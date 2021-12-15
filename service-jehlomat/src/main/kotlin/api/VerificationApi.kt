package api

import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import services.DatabaseService
import services.JwtManager
import services.PermissionService
import services.JWT_CONFIG_NAME


fun Route.verificationApi(database: DatabaseService, jwtManager: JwtManager): Route {
    return route("/") {
        authenticate(JWT_CONFIG_NAME) {
            get ("/organization") {
                val organizationId = call.parameters["orgId"]?.toIntOrNull()

                if (organizationId != null) {
                    if (!PermissionService.isUserSuperAdmin(jwtManager.getLoggedInUser(call, database))) {
                        call.respond(HttpStatusCode.Forbidden)
                        return@get
                    }

                    val currentOrganization = database.selectOrganizationById(organizationId)

                    if (currentOrganization != null) {
                        database.updateOrganization(currentOrganization.copy(verified = true))
                        call.respond(HttpStatusCode.OK)
                    } else {
                        call.respond(HttpStatusCode.NotFound)
                    }
                } else {
                    call.respond(HttpStatusCode.NoContent)
                }
            }
        }
        get ("/user") {
            val userId = call.parameters["userId"]?.toIntOrNull()

            if (userId != null) {
                val currentUser = database.selectUserById(userId)

                if (currentUser != null) {
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
}
