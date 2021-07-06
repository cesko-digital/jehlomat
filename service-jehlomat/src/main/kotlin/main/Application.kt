package main

import api.syringeApi
import api.googlePlacesProxy
import api.organizationApi
import api.teamApi
import api.userApi
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.joda.JodaModule
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.jackson.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.Demolisher
import model.Syringe
import org.koin.ktor.ext.Koin
import java.text.SimpleDateFormat
import java.util.*

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

    val syringe = Syringe(
        0,
        1,
        "username",
        photo = 0,
        count = 10,
        "note",
        Demolisher.CITY_POLICE,
        "10L:10W"
    )

    routing {
        route("/api/v1/jehlomat/syringe") {
            syringeApi()
        }
        route("/api/v1/jehlomat/users") {
            userApi()
        }
        route("/api/v1/jehlomat/organization") {
            organizationApi()
        }
        route("/api/v1/jehlomat/team") {
            teamApi()
        }
    }
}