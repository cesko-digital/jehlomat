package main

import api.*
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.joda.JodaModule
import com.papsign.ktor.openapigen.OpenAPIGen
import com.papsign.ktor.openapigen.openAPIGen
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.features.*
import io.ktor.http.content.*
import io.ktor.jackson.*
import io.ktor.response.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.routing.*
import org.koin.dsl.module
import org.koin.ktor.ext.Koin
import org.koin.ktor.ext.inject
import org.slf4j.event.Level
import services.*

val jwtModule = module {
    single { JwtManager() }
}

val databaseModule = module {
    single { DatabaseService() }
}

val mailerModule = module {
    single<MailerService> { Mailer() }
}

var testMailerModule = module {
    single<MailerService> { FakeMailer() }
}

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)


@Suppress("unused", "UNUSED_PARAMETER") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {

    install(CORS){
        header(HttpHeaders.ContentType)
        header("key")
        anyHost()
    }


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
            if (testing){
                listOf(
                    localModule,
                    databaseModule,
                    testMailerModule,
                    jwtModule
                )
            } else {
                listOf(
                    productionModule,
                    databaseModule,
                    mailerModule,
                    jwtModule
                )
            }
        )
    }

    val service by inject<DatabaseService>()
    val mailer by inject<MailerService>()
    val jwtManager by inject<JwtManager>()

    install(Authentication) {
        jwt(JWT_CONFIG_NAME) {
            realm = jwtManager.realm

            verifier(jwtManager.createVerifier())
            validate { credential ->
                if (credential.payload.getClaim(JWT_PAYLOAD_PROPERTY_NAME) != null) {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }
        }
    }

    routing {
        get("/openapi.json") {
            call.respond(application.openAPIGen.api.serialize())
        }
        get("/") {
            call.respondRedirect("/swagger-ui/index.html?url=/static/swagger.json", true)
        }
        route("/api/v1/jehlomat/syringe") {
            syringeApi(service, jwtManager, mailer)
        }
        route("/api/v1/jehlomat/user") {
            userApi(service, jwtManager, mailer)
        }
        route("/api/v1/jehlomat/organization") {
            organizationApi(service, jwtManager, mailer)
        }
        route("/api/v1/jehlomat/verification") {
            verificationApi(service, jwtManager)
        }
        route("/api/v1/jehlomat/location") {
            locationApi(service)
        }
        route("/api/v1/jehlomat/team") {
            teamApi(service, jwtManager)
        }
        route("/api/v1/jehlomat/login") {
            loginApi(service, jwtManager)
        }
        route("/api/v1/jehlomat/admin") {
            adminApi(service)
        }
        get("/.well-known/jwks.json") {
            call.respond(jwtManager.generateJwk())
        }
        static("/static") {
            resources("files")
        }
    }
}
