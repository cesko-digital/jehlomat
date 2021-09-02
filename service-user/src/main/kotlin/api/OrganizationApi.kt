package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.*

val organizations = mutableListOf<Organization>()


fun Route.organizationApi(): Route {

    return route("/") {
        get("/{organization}") {
            // TODO: check if values satisfy condition
            // TODO: check if adminitrator is logged user

            val organization = call.parameters["organization"]
            try {
                val filteredOrganization = organizations.filter { it.name == organization }[0]
                call.respond(HttpStatusCode.OK, filteredOrganization)
            } catch (ex: IndexOutOfBoundsException) {
                call.respond(HttpStatusCode.NotFound)
            }
        }

        post {
            val organization = call.receive<Organization>()
            // TODO: check if values satisfy condition
            // TODO: check if adminitrator is logged user

            when {
                organizations.any { it.name == organization.name } -> {
                    call.respond(HttpStatusCode.Conflict)
                }
                organization.teams.any { it !in teams } -> {
                    call.respond(HttpStatusCode.NotFound, "One of more username from users does not exists")
                }
                else -> {
                    organizations.add(organization)
                    call.respond(HttpStatusCode.Created)
                }
            }
        }

        put {
            // TODO: check if values satisfy condition
            // TODO: check if adminitrator is logged user

            val newOrganization = call.receive<Organization>()

            val currentOrganizations = organizations.filter { it == newOrganization }

            if (currentOrganizations.isEmpty()) {
                call.respond(HttpStatusCode.NotFound)
            } else {
                val currentOrganization = currentOrganizations[0]

                when {
                    currentOrganizations.isEmpty() -> {
                        call.respond(HttpStatusCode.NotFound)
                    }
                    organizations.any { it.name == newOrganization.name } -> {
                        call.respond(HttpStatusCode.Conflict)
                    }
                    newOrganization.teams.any { it !in teams } -> {
                        call.respond(HttpStatusCode.NotFound, "One of more username from users does not exists")
                    }
                    currentOrganization.administrator.verified.not() -> {
                        call.respond(HttpStatusCode.PreconditionFailed, "Administrator is not verified yet")
                    }
                    else -> {
                        organizations.removeIf { it.name == currentOrganization.name }
                        organizations.add(currentOrganization)
                        call.respond(HttpStatusCode.OK)
                    }
                }
            }


        }
    }
}