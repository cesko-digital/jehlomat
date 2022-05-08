package api

import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.user.OrgAdminVerificationRequest
import model.user.UserStatus
import model.user.UserVerificationRequest
import services.*
import utils.isValidPassword
import utils.isValidUsername


fun Route.verificationApi(database: DatabaseService, jwtManager: JwtManager, mailer: MailerService): Route {
    return route("") {
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

                        val orgAdmin = database.findAdmin(currentOrganization)
                        mailer.sendOrgAdminConfirmationEmail(orgAdmin, currentOrganization.name)
                        call.respond(HttpStatusCode.OK)
                    } else {
                        call.respond(HttpStatusCode.NotFound)
                    }
                } else {
                    call.respond(HttpStatusCode.NoContent)
                }
            }
        }

        post ("/user") {
            val request = call.receive<UserVerificationRequest>()
            val user = database.selectUserByEmail(request.email)

            when {
                (user == null || user.status != UserStatus.NOT_VERIFIED || user.verificationCode != request.code) -> {
                    // everything is 404 on purpose to not inform about existed users
                    call.respond(HttpStatusCode.NotFound)
                }
                (!request.username.isValidUsername()) -> {
                    call.respond(HttpStatusCode.BadRequest, "Wrong username format.")
                }
                (!request.password.isValidPassword()) -> {
                    call.respond(HttpStatusCode.BadRequest, "Wrong password format.")
                }
                else -> {
                    var isUserNameUnique = false
                    synchronized(database) {
                        if (database.selectUserByUsername(request.username) == null) {
                            database.updateUser(user.copy(
                                status = UserStatus.ACTIVE,
                                username = request.username,
                                password = request.password
                            ))
                            isUserNameUnique = true
                        }
                    }

                    if (isUserNameUnique) {
                        call.respond(HttpStatusCode.OK)
                    } else {
                        call.respond(HttpStatusCode.BadRequest, "User name is already taken")
                    }
                }
            }
        }

        post ("/org-admin") {
            val request = call.receive<OrgAdminVerificationRequest>()
            val user = database.selectUserById(request.userId)

            if (user == null || user.status != UserStatus.NOT_VERIFIED || user.verificationCode != request.code || !user.isAdmin) {
                // everything is 404 on purpose to not inform about existed users
                call.respond(HttpStatusCode.NotFound)
                return@post
            }

            val organization = database.selectOrganizationById(user.organizationId)
            if (organization == null || !organization.verified) {
                call.respond(HttpStatusCode.NotFound)
                return@post
            }

            database.updateUserStatus(user.id, UserStatus.ACTIVE)
            call.respond(HttpStatusCode.OK)
        }
    }
}
