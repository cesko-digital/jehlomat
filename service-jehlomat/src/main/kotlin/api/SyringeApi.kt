package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.*
import services.DatabaseService

import services.MailerService
import utils.isValidMail


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
            val syringe = call.receive<Syringe>()
            if (syringe.userId != null) {
                val user = database.selectUserById(syringe.userId)
                if (user == null) {
                    call.respond(HttpStatusCode.BadRequest, "The founder doesn't exist")
                    return@post
                }
            }

            val syringeId = database.insertSyringe(syringe)
            if (syringeId == null) {
                call.respond(HttpStatusCode.InternalServerError, "A syringe cannot be created, please try again later")
                return@post
            }

            val teamsInLocation = database.resolveTeamsInLocation(syringe.gps_coordinates)
            teamsInLocation.forEach {
                val organization = database.selectOrganizationById(it.organizationId)
                val admin = database.findAdmin(organization!!)
                mailer.sendSyringeFinding(organization, admin.toUserInfo(), syringeId)
            }

            call.respond(HttpStatusCode.Created, SyringeCreateResponse(id = syringeId, teamAvailable = teamsInLocation.isNotEmpty()))
        }

        put {
            database.updateSyringe(call.receive())
            call.respond(HttpStatusCode.OK)
        }

        route("/{id}") {
            get {
                val id = call.parameters["id"]
                val result = id?.let { it1 -> database.selectSyringeById(it1) }
                if (result != null) {
                    call.respond(HttpStatusCode.OK, result)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }

            post("/track") {
                val id = call.parameters["id"]
                val syringe = id?.let { it1 -> database.selectSyringeById(it1) }
                val syringeTracking = call.receive<SyringeTrackingRequest>()

                when {
                    (syringe == null) -> {
                        call.respond(HttpStatusCode.NotFound)
                    }
                    (!syringeTracking.email.isValidMail()) -> {
                        call.respond(HttpStatusCode.BadRequest, "The email is not valid.")
                    }
                    else -> {
                        mailer.sendSyringeFindingConfirmation(syringeTracking.email, syringe.id)
                        call.respond(HttpStatusCode.NoContent)
                    }
                }
            }

            delete {
                val id = call.parameters["id"]

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
