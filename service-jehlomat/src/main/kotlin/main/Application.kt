package main

import api.*
import com.fasterxml.jackson.databind.JsonMappingException
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.joda.JodaModule
import com.fasterxml.jackson.module.kotlin.MissingKotlinParameterException
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.features.*
import io.ktor.jackson.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import model.exception.UnknownLocationException
import org.koin.dsl.module
import org.koin.ktor.ext.Koin
import org.koin.ktor.ext.inject
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
@JvmOverloads
fun Application.module(testing: Boolean = false) {

    install(CORS){
        header(HttpHeaders.ContentType)
        header(HttpHeaders.Authorization)
        header(HttpHeaders.AccessControlAllowOrigin)
        header("key")
        anyHost()
        method(HttpMethod.Options)
        method(HttpMethod.Put)
        method(HttpMethod.Delete)
        allowNonSimpleContentTypes = true
        allowCredentials = true
        allowSameOrigin = true
    }

    install(StatusPages) {
        exception<MissingKotlinParameterException> { cause ->
            call.respond(HttpStatusCode.BadRequest, "The request parameter ${cause.path.joinToString(".") { a -> a?.fieldName?:"" }} is missing.")
        }

        exception<JsonMappingException> { cause ->
            call.respond(HttpStatusCode.BadRequest, "The request parameter ${cause.path.joinToString(".") { a -> a?.fieldName?:"" }} has a wrong type.")
        }

        exception<UnknownLocationException> { cause ->
            call.respond(HttpStatusCode.BadRequest, cause.message!!)
        }

        exception<Throwable> { cause ->
            log.error("Uncaught exception ${cause.message} \n ${cause.stackTraceToString()}")
            call.respond(HttpStatusCode.InternalServerError)
        }
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
            verificationApi(service, jwtManager, mailer)
        }
        route("/api/v1/jehlomat/location") {
            locationApi(service)
        }
        route("/api/v1/jehlomat/password-reset") {
            passwordResetApi(service, mailer)
        }
        route("/api/v1/jehlomat/team") {
            teamApi(service, jwtManager)
        }
        route("/api/v1/jehlomat/login") {
            loginApi(service, jwtManager)
        }
    }
}
