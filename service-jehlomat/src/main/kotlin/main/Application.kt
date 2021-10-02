package main

import api.*
import model.Syringe
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.joda.JodaModule
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.content.*
import io.ktor.jackson.*
import io.ktor.routing.*
import org.koin.dsl.module
import org.koin.ktor.ext.Koin
import org.koin.ktor.ext.inject
import org.ktorm.database.Database
import org.ktorm.dsl.insertAndGenerateKey

import org.ktorm.dsl.from
import org.ktorm.dsl.select
import service.DatabaseService
//import service.DatabaseServiceImpl


interface HelloService {
    fun sayHello(): String
}

class HelloServiceImpl() : HelloService {
    override fun sayHello() = "Hello !"
}

//val helloAppModule = module {
//    single<HelloService> { HelloServiceImpl() } // get() Will resolve HelloRepository
//}


val syringes = mutableListOf<Syringe>()

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
    }

    val host = "localhost"
    val port = "5432"
    val database = "postgres"
    val user = "jehlomat"
    val password = "jehlomat"

    routing {
        val databaseInstance = DatabaseService.getInstance(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )
        route("/api/v1/jehlomat/syringe") {
            syringeApi(databaseInstance)
        }
        route("/api/v1/jehlomat/users") {
            userApi(databaseInstance)
        }
        route("/api/v1/jehlomat/organization") {
            organizationApi()
        }
        route("/api/v1/jehlomat/team") {
            teamApi()
        }
        static("/static") {
            resources("files")
        }
    }
}