package main

import api.*
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.joda.JodaModule
import com.papsign.ktor.openapigen.OpenAPIGen
import com.papsign.ktor.openapigen.openAPIGen
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.content.*
import io.ktor.jackson.*
import io.ktor.response.*
import io.ktor.routing.*
import org.koin.dsl.module
import org.koin.ktor.ext.Koin
import org.koin.ktor.ext.inject
import service.DatabaseService
import service.DatabaseServiceImpl
import services.Mailer


val databaseModule = module {
    single<DatabaseService> { DatabaseServiceImpl() }
}

val mailerModule = module {
    single { Mailer() }
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

    install(OpenAPIGen) {
        // basic info
        info {
            version = "0.0.1"
            title = "Test API"
            description = "The Test API"
            contact {
                name = "Support"
                email = "support@test.com"
            }
        }
        // describe the server, add as many as you want
        server("http://localhost:8082/") {
            description = "Test server"
        }

        serveSwaggerUi = true
        swaggerUiPath = "/swagger-ui"
    }

    install(CallLogging)

    install(Koin) {
        modules(
            if (isLocal()) {
                listOf(
                    localModule,
                    databaseModule,
                    mailerModule
                )
            } else {
                listOf(
                    productionModule,
                    databaseModule,
                    mailerModule
                )
            }
        )
    }

    val service by inject<DatabaseService>()
    val mailer by inject<Mailer>()

    routing {
        get("/openapi.json") {
            call.respond(application.openAPIGen.api.serialize())
        }
        get("/") {
            call.respondRedirect("/swagger-ui/index.html?url=/static/swagger.json", true)
        }
        route("/api/v1/jehlomat/syringe") {
            syringeApi(service, mailer)
        }
        route("/api/v1/jehlomat/users") {
            userApi(service)
        }
        route("/api/v1/jehlomat/organization") {
            organizationApi(mailer)
        }
        route("/api/v1/jehlomat/verification") {
            verificationApi()
        }
        route("/api/v1/jehlomat/team") {
            teamApi()
        }
        static("/static") {
            resources("files")
        }
    }
}
