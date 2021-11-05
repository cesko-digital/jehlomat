package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.*
import services.MailerService

val organizations = mutableListOf<Organization>()


fun Route.organizationApi(mailer: MailerService): Route {
    return route("/") {
        get {
            call.respond(HttpStatusCode.OK, organizations)
        }

        get("/{name}") {
            // TODO: check if values satisfy condition
            // TODO: check if adminitrator is logged user

            try {
                val filteredOrganization = organizations.filter {
                    it.name == call.parameters["name"]
                }[0]
                call.respond(HttpStatusCode.OK, filteredOrganization)
            } catch (ex: IndexOutOfBoundsException) {
                call.respond(HttpStatusCode.NotFound, "Organization not found")
            }
        }

        post {
            val organization = call.receive<Organization>()
            // TODO: check if values satisfy condition
            // TODO: check if adminitrator is logged user

            when {
                organizations.any { it.name == organization.name } -> {
                    call.respond(HttpStatusCode.Conflict, "Organization name already exists")
                }
                else -> {
                    organizations.add(organization)
                    mailer.sendRegistrationConfirmationEmail(organization)
                    call.respond(HttpStatusCode.Created)
                }
            }
        }

        put {
            // TODO: check if values satisfy condition
            // TODO: check if adminitrator is logged user

            val newOrganization = call.receive<Organization>()

            val currentOrganizations = organizations.filter {
                it.name == newOrganization.name
            }

            if (currentOrganizations.isEmpty()) {
                call.respond(HttpStatusCode.NotFound, "Organization not found")
            } else {
                val currentOrganization = currentOrganizations[0]
                organizations.removeIf { it.name == currentOrganization.name }
                organizations.add(newOrganization)
                call.respond(HttpStatusCode.OK)
            }


        }
    }
}
