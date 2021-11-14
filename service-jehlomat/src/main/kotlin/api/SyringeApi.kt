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
                parameters["userId"]?.toInt(), demolisher,
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
                1,
                "TestOrg",
                true
            )

            val dummyUser = UserInfo(3, "example@example.org", false, 1, 2, false)
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
                val id = call.parameters["id"]?.toIntOrNull()
                val result = id?.let { it1 -> database.selectSyringeById(it1) }
                if (result != null) {
                    call.respond(HttpStatusCode.OK, result)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }

            delete {
                val id = call.parameters["id"]?.toIntOrNull()

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
