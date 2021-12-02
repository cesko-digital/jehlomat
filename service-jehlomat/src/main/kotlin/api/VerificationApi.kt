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
        get("/{id}") {
            // TODO: check if values satisfy condition
            // TODO: check if adminitrator is logged user

            val id = call.parameters["id"]?.toIntOrNull()
            val currentOrganization = id?.let { it1 -> database.selectOrganizationById(it1) }

            if (currentOrganization != null ) {
                database.updateOrganization(currentOrganization.copy(verified = true))
                call.respond(HttpStatusCode.OK)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }
    }
}
