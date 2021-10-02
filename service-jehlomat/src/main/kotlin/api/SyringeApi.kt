package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.Demolisher
import model.Organization
import model.Syringe
import service.DatabaseService

import model.UserInfo
import services.Mailer

val syringes = mutableListOf<Syringe>()


fun Route.syringeApi(database: DatabaseService): Route {

    val mailer = Mailer()
    return route("/") {
        get("all") {
            val parameters = call.request.queryParameters

            val from = parameters["from"]?.toLong() ?: 0L
            val to = parameters["to"]?.toLong() ?: System.currentTimeMillis()
            val email = parameters["email"] ?: ""
            val demolisher = try {
                parameters["demolisher"]?.let { Demolisher.valueOf(it) } ?: run { Demolisher.NO }
            } catch (ex: IllegalArgumentException) {
                Demolisher.NO
            }
            val gpsCoordinates = parameters["gps_coordinates"] ?: ""
            val demolished = parameters["demolished"]?.toBoolean() ?: false

            val filteredSyringes = syringes.filter{
                it.timestamp in from..to
                        && it.demolisher == demolisher
                        && (email.isBlank() || it.email == email )
                        // todo: use postgis in future
                        && (gpsCoordinates.isBlank() || it.gps_coordinates == gpsCoordinates )
                        && demolished == it.demolished
            }

            val responseCode = if (filteredSyringes.isEmpty()) {
                HttpStatusCode.NotFound
            } else {
                HttpStatusCode.OK
            }

            call.respond(responseCode, filteredSyringes)
        }

        post {
            val dummyOrganization  = Organization(
                "TestOrg",
                UserInfo("bares.jakub@gmail.com", false),
                teams = listOf(),
                verified = true
            )
            val dummyUser = UserInfo("bares.jakub@gmail.com", false)
            mailer.sendSyringeFindingConfirmation(dummyUser)
            mailer.sendSyringeFinding(dummyOrganization)
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
