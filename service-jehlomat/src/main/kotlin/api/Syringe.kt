package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.Demolisher
import model.Syringe
import java.text.SimpleDateFormat
import java.util.*


val syringes = mutableListOf<Syringe>()


fun Route.syringeApi(): Route {

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

    return route("/") {
        get("all") {
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

        post {
            syringes.add(call.receive())
            call.respond(HttpStatusCode.Created)
        }

        route("/{id}") {
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
    }
}