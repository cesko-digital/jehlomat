package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.*
import services.DatabaseService

import services.MailerService


fun Route.syringeApi(database: DatabaseService, mailer: MailerService): Route {

    return route("/") {
        get("all") {
            val parameters = call.request.queryParameters

            val demolisher = try {
                parameters["demolisher"]?.let { Demolisher.valueOf(it) } ?: run { Demolisher.NO }
            } catch (ex: IllegalArgumentException) {
                Demolisher.NO
            }

            val filteredSyringes = database.selectSyringes(
                parameters["from"]?.toLong() ?: 0L,
                parameters["to"]?.toLong() ?: System.currentTimeMillis(),
                parameters["email"] ?: "", demolisher,
                parameters["gps_coordinates"] ?: "",
                parameters["demolished"]?.toBoolean() ?: false
            )

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
                "example@example.org",
                "password",
                verified = true
            )

            val dummyUser = UserInfo("example@example.org", "team1", false)
            database.insertSyringe(call.receive())
            mailer.sendSyringeFindingConfirmation(dummyUser)
            mailer.sendSyringeFinding(dummyOrganization)
            call.respond(HttpStatusCode.Created)
        }

        put {
            database.updateSyringe(call.receive())
            call.respond(HttpStatusCode.OK)
        }

        route("/{id}") {
            get {
                val id = call.parameters["id"]?.toInt()
                val result = id?.let { it1 -> database.selectSyringeById(it1) }
                if (result != null) {
                    call.respond(HttpStatusCode.OK, result)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }

            delete {
                val id = call.parameters["id"]?.toInt()

                if (id != null) {
                    database.deleteSyringe(id)
                    call.respond(HttpStatusCode.OK)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }

            }
        }
    }
}
