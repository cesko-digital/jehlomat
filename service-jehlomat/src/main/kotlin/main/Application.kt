package main

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
        route("/api/v1/jehlomat") {

            get("/syringes") {
                val format = SimpleDateFormat.getInstance()
                val parameters = call.request.queryParameters

                val city = parameters["city"]
                val username = parameters["username"]
                val from = Date(parameters["from"]?.toLong() ?: 0L)
                val to = Date(parameters["to"]?.toLong() ?: System.currentTimeMillis())
                val liquidationStatus = try {
                    parameters["status"]?.let { Demolisher.valueOf(it) } ?: run { Demolisher.NO }
                } catch (ex: IllegalArgumentException) {
                    Demolisher.NO
                }

                // pass to database query and retrieve from it

                call.respond(listOf(syringe))
            }

            route("/syringe/{id}") {
                get {
                    val id = call.parameters["id"]?.toLong()
                    try {
                        val filteredSyringe = syringes.filter { it.id == id }[0]
                        call.respond(HttpStatusCode.OK, filteredSyringe)
                    } catch (ex: IndexOutOfBoundsException) {
                        call.respond(HttpStatusCode.NotFound)
                    }
                }

                put {
                    val id = call.parameters["id"]?.toLong()
                    syringes.removeIf { it.id == id }
                    syringes.add(call.receive())
                    call.respond(HttpStatusCode.OK)
                }

                delete {
                    val id = call.parameters["id"]?.toLong()
                    syringes.removeIf { it.id == id }
                    call.respond(HttpStatusCode.OK)
                }
            }

            post("/syringe") {
                syringes.add(call.receive())
                call.respond(HttpStatusCode.Created)
            }
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