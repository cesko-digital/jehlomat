package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.*
import services.DatabaseService
import services.Mailer


fun Route.verificationApi(database: DatabaseService): Route {
    return route("/") {
        get("/{organizationName}") {
            // TODO: check if values satisfy condition
            // TODO: check if adminitrator is logged user

            val organizationName = call.parameters["organizationName"]!!

            val currentOrganization = database.selectOrganizationByName(organizationName)

            if (currentOrganization == null) {
                call.respond(HttpStatusCode.NotFound)
            } else {
                database.updateOrganization(currentOrganization)
                call.respond(HttpStatusCode.OK)
            }
        }
    }
}
