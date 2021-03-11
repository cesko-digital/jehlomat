package main

import api.googlePlacesProxy
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.joda.JodaModule
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.jackson.*
import io.ktor.response.*
import io.ktor.routing.*
import org.koin.ktor.ext.Koin

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

    routing {
        route("/api/v1/jehlomat") {
            googlePlacesProxy()
        }
        get("/") {
            call.respond("service-jehlomat")
        }
        get("/api/v1/jehlomat/1") {
            call.respond("service-jehlomat")
        }
    }
}