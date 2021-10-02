package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.*
import services.Mailer


fun Route.verificationApi(): Route {
    return route("/") {
        get {
            // TODO: check if values satisfy condition
            // TODO: check if adminitrator is logged user

            val organizationName = call.receiveParameters().get("orgName")

            val currentOrganizations = organizations.filter { it.name == organizationName }

            if (currentOrganizations.isEmpty()) {
                call.respond(HttpStatusCode.NotFound)
            } else {
                val currentOrganization = currentOrganizations[0]
                currentOrganization.verified = true
                call.respond(HttpStatusCode.OK)
            }


        }
    }
}
