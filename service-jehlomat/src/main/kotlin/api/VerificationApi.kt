package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import services.DatabaseService


fun Route.verificationApi(database: DatabaseService): Route {
    return get {
        val organizationId = call.parameters["orgId"]?.toIntOrNull()
        val userId = call.parameters["userId"]?.toIntOrNull()

        if (organizationId != null) {
            val currentOrganization = database.selectOrganizationById(organizationId)

            if (currentOrganization != null ) {
                database.updateOrganization(currentOrganization.copy(verified = true))
                call.respond(HttpStatusCode.OK)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        } else if(userId != null) {
            val currentUser = database.selectUserById(userId)

            if (currentUser != null ) {
                database.updateUser(currentUser.copy(verified = true))
                call.respond(HttpStatusCode.OK)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        } else {
            call.respond(HttpStatusCode.NoContent)
        }
    }
}
