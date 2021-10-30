package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.*
import services.Mailer

val organizations = mutableListOf<Organization>()


fun Route.organizationApi(mailer: Mailer): Route {
    return route("/") {
        get("/{email}") {
            // TODO: check if values satisfy condition
            // TODO: check if adminitrator is logged user

            try {
                val filteredOrganization = organizations.filter {
                    it.administrator.email == call.parameters["email"]
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
                organizations.any { it.administrator.email == organization.administrator.email } -> {
                    call.respond(HttpStatusCode.Conflict, "Organization email already exists")
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
                it.administrator.email == newOrganization.administrator.email
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
