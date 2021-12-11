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
import utils.isValidPassword
import utils.isValidUsername


fun Route.organizationApi(database: DatabaseService, mailer: MailerService): Route {
    return route("/") {
        get {
            call.respond(HttpStatusCode.OK, database.selectOrganizations())
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            val organization = id?.let { it1 -> database.selectOrganizationById(it1) }

            if (organization != null ) {
                call.respond(HttpStatusCode.OK, organization)
            } else {
                call.respond(HttpStatusCode.NotFound, "Organization not found")
            }
        }

        post {
            val registration = call.receive<OrganizationRegistration>()
            when {
                (!registration.email.isValidMail()) -> {
                    call.respond(HttpStatusCode.BadRequest, "Wrong e-mail format")
                }
                (!registration.password.isValidPassword()) -> {
                    call.respond(HttpStatusCode.BadRequest, "Wrong password format")
                }
                (!registration.name.isValidUsername()) -> {
                    call.respond(HttpStatusCode.BadRequest, "Wrong name format")
                }
                database.selectUserByEmail(registration.email) != null -> {
                    call.respond(HttpStatusCode.Conflict, "E-mail already taken")
                }
                database.selectOrganizationByName(registration.name) != null -> {
                    call.respond(HttpStatusCode.Conflict, "Organization name already exists")
                }
                else -> {
                    database.useTransaction {
                        val organization = Organization(0, registration.name, false)
                        val orgId = database.insertOrganization(organization)

                        //todo: check if username should be filled in for organization different than organization name
                        val user = User(0, registration.email, registration.name, registration.password,false, orgId, null, true)
                        val userId = database.insertUser(user)

                        val userWithCorrectId = user.copy(id = userId).toUserInfo()
                        mailer.sendOrganizationConfirmationEmail(organization.copy(id = orgId), userWithCorrectId)
                        mailer.sendRegistrationConfirmationEmail(organization.copy(id = orgId), userWithCorrectId)
                    }

                    call.respond(HttpStatusCode.Created)
                }
            }
        }

        put {
            val newOrganization = call.receive<Organization>()
            val currentOrganization = database.selectOrganizationById(newOrganization.id)

            when {
                currentOrganization == null -> {
                    call.respond(HttpStatusCode.NotFound, "Organization not found")
                }
                (newOrganization.name != currentOrganization.name && database.selectOrganizationByName(newOrganization.name) != null) -> {
                    call.respond(HttpStatusCode.Conflict, "The new name is already used by a different organization")
                }
                else -> {
                    database.updateOrganization(newOrganization)
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}
