package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.*
import services.DatabaseService
import services.MailerService


fun Route.organizationApi(database: DatabaseService, mailer: MailerService): Route {
    return route("/") {
        get {
            call.respond(HttpStatusCode.OK, database.selectOrganizations())
        }

        get("/{name}") {
            // TODO: check if values satisfy condition
            // TODO: check if adminitrator is logged user

            val organization = database.selectOrganizationByName(call.parameters["name"]!!)

            if (organization != null) {
                call.respond(HttpStatusCode.OK, organization)
            } else {
                call.respond(HttpStatusCode.NotFound, "Organization not found")
            }
        }

        post {
            val organization = call.receive<Organization>()
            // TODO: check if values satisfy condition
            // TODO: check if adminitrator is logged user

            val organizationInDB = database.selectOrganizationByName(organization.name)

            if (organizationInDB != null) {
                call.respond(HttpStatusCode.Conflict, "Organization name already exists")
            } else {
                database.insertOrganization(organization)
                mailer.sendRegistrationConfirmationEmail(organization)
                call.respond(HttpStatusCode.Created)
            }
        }

        put {
            // TODO: check if values satisfy condition
            // TODO: check if adminitrator is logged user

            val newOrganization = call.receive<Organization>()

            val organizationInDB = database.selectOrganizationByName(newOrganization.name)

            if (organizationInDB == null) {
                call.respond(HttpStatusCode.NotFound, "Organization not found")
            } else {
                database.updateOrganization(newOrganization)
                call.respond(HttpStatusCode.OK)
            }
        }
    }
}
