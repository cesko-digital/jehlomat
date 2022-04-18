package api

import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.Role
import model.user.*
import org.mindrot.jbcrypt.BCrypt
import services.*
import utils.isValidMail
import utils.isValidPassword
import utils.isValidUsername

fun Route.userApi(databaseInstance: DatabaseService, jwtManager: JwtManager, mailer: MailerService): Route {

    return route("") {
        authenticate(JWT_CONFIG_NAME) {
            get {
                val loggedInUser = jwtManager.getLoggedInUser(call, databaseInstance)
                call.respond(HttpStatusCode.OK, loggedInUser.toUserDetail())
            }

            get("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull()
                val user = id?.let { it1 -> databaseInstance.selectUserById(it1) }

                if (user != null ) {
                    call.respond(HttpStatusCode.OK, user.toUserInfo())
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }

            post {
                val loggedInUser = jwtManager.getLoggedInUser(call, databaseInstance)
                if (!loggedInUser.isAdmin) {
                    call.respond(HttpStatusCode.Forbidden, "Users can be created only by organization admins.")
                }

                val request = call.receive<UserRegistrationRequest>()
                when {
                    (!request.email.isValidMail()) -> {
                        call.respond(HttpStatusCode.BadRequest, "Wrong E-mail format.")
                    }
                    databaseInstance.selectUserByEmail(request.email) != null -> {
                        call.respond(HttpStatusCode.Conflict, "E-mail already taken")
                    }
                    else -> {
                        val verificationCode = RandomIdGenerator.generateRegistrationCode()
                        val newUser = User(
                            id = 0,
                            email = request.email,
                            username = "",
                            password = "",
                            verified = false,
                            verificationCode = verificationCode,
                            organizationId = loggedInUser.organizationId,
                            teamId = null,
                            isAdmin = false
                        )
                        databaseInstance.insertUser(newUser)
                        val organization = databaseInstance.selectOrganizationById(loggedInUser.organizationId)

                        mailer.sendRegistrationConfirmationEmail(
                            organization!!,
                            request.email,
                            verificationCode
                        )
                        call.respond(HttpStatusCode.Created)
                    }
                }
            }

            put("/{id}/attributes") {
                val newUser = call.receive<UserChangeRequest>()
                val id = call.parameters["id"]?.toIntOrNull()
                val userToChange = id?.let { it1 -> databaseInstance.selectUserById(it1) }

                when {
                    userToChange == null -> {
                        call.respond(HttpStatusCode.NotFound)
                    }
                    userToChange.verified.not() -> {
                        call.respond(HttpStatusCode.PreconditionFailed, "User is not verified yet")
                    }
                    (!userToChange.username.isValidUsername()) -> {
                        call.respond(HttpStatusCode.BadRequest, "Wrong username format.")
                    }
                    (!userToChange.email.isValidMail()) -> {
                        call.respond(HttpStatusCode.BadRequest, "Wrong E-mail format.")
                    }
                    (newUser.email != userToChange.email && databaseInstance.selectUserByEmail(newUser.email) != null) -> {
                        call.respond(HttpStatusCode.BadRequest, "E-mail already taken")
                    }
                    else -> {
                        if (!RequestValidationWrapper.validatePutObject(call, jwtManager, databaseInstance, userToChange, newUser.toUser(userToChange))) {
                            return@put
                        }

                        var isUserNameUnique = false
                        synchronized(databaseInstance) {
                            if (newUser.username == userToChange.username || databaseInstance.selectUserByUsername(newUser.username) == null) {
                                databaseInstance.updateUserAttributes(id, newUser)
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

            put("/{id}/password") {
                val passwordReq = call.receive<UserPasswordRequest>()
                val id = call.parameters["id"]?.toIntOrNull()
                val userToChange = id?.let { it1 -> databaseInstance.selectUserById(it1) }

                if (userToChange == null) {
                    call.respond(HttpStatusCode.NotFound)
                    return@put
                }

                val loggedInUser = jwtManager.getLoggedInUser(call, databaseInstance)
                val roles = PermissionService.determineRoles(loggedInUser, userToChange)
                if (!roles.contains(Role.UserOwner)) {
                    call.respond(HttpStatusCode.Forbidden, "Users can change only their own password.")
                    return@put
                }

                when {
                    userToChange.verified.not() -> {
                        call.respond(HttpStatusCode.PreconditionFailed, "User is not verified yet")
                    }
                    (!BCrypt.checkpw(passwordReq.oldPassword, userToChange.password)) -> {
                        call.respond(HttpStatusCode.BadRequest, "Wrong old password.")
                    }
                    (!passwordReq.newPassword.isValidPassword()) -> {
                        call.respond(HttpStatusCode.BadRequest, "Wrong password format.")
                    }
                    else -> {
                        databaseInstance.updateUserPassword(id, passwordReq.newPassword)
                        call.respond(HttpStatusCode.OK)
                    }
                }
            }
        }
    }
}
