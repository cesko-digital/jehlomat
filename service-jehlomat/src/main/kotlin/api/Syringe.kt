package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.Demolisher
import model.Syringe


val syringes = mutableListOf<Syringe>()


fun Route.syringeApi(): Route {

    return route("/") {
        get("all") {
            val parameters = call.request.queryParameters

            val city = parameters["city"] ?: ""
            val username = parameters["username"] ?: ""
            val from = parameters["from"]?.toLong() ?: 0L
            val to = parameters["to"]?.toLong() ?: System.currentTimeMillis()
            val demolisher = try {
                parameters["demolisher"]?.let { Demolisher.valueOf(it) } ?: run { Demolisher.NO }
            } catch (ex: IllegalArgumentException) {
                Demolisher.NO
            }

            var filteredSyringes = syringes.filter{ it.timestamp in from..to && it.demolisher == demolisher}

            if (city.isNotBlank()) {
                filteredSyringes = filteredSyringes.filter{ it.city == city }
            }

            if (username.isNotBlank()) {
                filteredSyringes = filteredSyringes.filter{ it.username == username }
            }

            if (filteredSyringes.isEmpty()) {
                call.respond(HttpStatusCode.NotFound, listOf<Syringe>())
            } else {
                call.respond(filteredSyringes)
            }
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