package main

import api.syringeApi
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.joda.JodaModule
import db.DatabaseService
import db.DatabaseServiceImpl
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.jackson.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import org.koin.dsl.module
import org.koin.ktor.ext.Koin
import org.koin.ktor.ext.inject
import java.util.*



val helloAppModule = module {
    single<DatabaseService> {
            (
                host: String,
                port: String,
                database: String,
                user: String,
                password: String,
            ) ->
                    DatabaseServiceImpl(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )
    }
}


fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun isLocal(): Boolean {
    return System.getenv("isLocal")?.toBoolean() ?: false
}

@Suppress("unused", "UNUSED_PARAMETER") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {

    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
            registerModule(JodaModule())

            // Formatter: yyyy-MM-dd'T'HH:mm:ss.SSSZ
            configure(
                SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false
            )
        }
    }

    install(CallLogging)

    install(Koin) {
        modules(
            if (isLocal()) {
                listOf(
                    localModule
                )
            } else {
                listOf(
                    productionModule
                )
            }
        )
        modules(helloAppModule)
    }


//    print(environment.config.property("ktor.deployment.host"))
    print(environment.config.propertyOrNull("ktor.deployment.port")?.getString() ?: "NONE")

    val host: String = environment.config.property("ktor.databaseConfiguration.host").getString()
    val port: String = environment.config.property("ktor.databaseConfiguration.port").getString()
    val database: String = environment.config.property("ktor.databaseConfiguration.database").getString()
    val user: String = environment.config.property("ktor.databaseConfiguration.user").getString()
    val password: String = environment.config.property("ktor.databaseConfiguration.password").getString()

    val service: DatabaseServiceImpl by inject {
        org.koin.core.parameter.parametersOf(host, port, database, user, password)
    }

    routing {
        route("/api/v1/jehlomat/syringe") {
            syringeApi(service)
        }

        static("/static") {
            resources("files")
        }
    }
}