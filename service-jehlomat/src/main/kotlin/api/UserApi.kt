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
                    val loggedInUser = jwtManager.getLoggedInUser(call, databaseInstance)
                    val roles = PermissionService.determineRoles(loggedInUser, user)

                    call.respond(HttpStatusCode.OK, user.toUserInfo(roles.contains(Role.OrgAdmin)))
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }

            delete("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull()
                val user = id?.let { it1 -> databaseInstance.selectUserById(it1) }

                if (user == null) {
                    call.respond(HttpStatusCode.NotFound)
                    return@delete
                }

                if (user.status != UserStatus.ACTIVE) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@delete
                }

                val loggedInUser = jwtManager.getLoggedInUser(call, databaseInstance)
                val roles = PermissionService.determineRoles(loggedInUser, user)
                if (!roles.contains(Role.OrgAdmin)) {
                    call.respond(HttpStatusCode.Forbidden)
                    return@delete
                }

                databaseInstance.useTransaction {
                    databaseInstance.deactivateUser(id)
                    databaseInstance.unlockSyringes(id)
                }

                call.respond(HttpStatusCode.NoContent)
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
                            status = UserStatus.NOT_VERIFIED,
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
                    userToChange.status != UserStatus.ACTIVE -> {
                        call.respond(HttpStatusCode.PreconditionFailed, "User is not active")
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

                        databaseInstance.useTransaction {
                            synchronized(databaseInstance) {
                                if (newUser.username == userToChange.username || databaseInstance.selectUserByUsername(newUser.username) == null) {
                                    databaseInstance.updateUserAttributes(id, newUser)
                                    isUserNameUnique = true
                                }
                            }

                            if (newUser.email != userToChange.email) {
                                val verificationCode = RandomIdGenerator.generateRegistrationCode()
                                val organization = databaseInstance.selectOrganizationById(userToChange.organizationId)

                                databaseInstance.updateUserEmail(id, newUser.email, verificationCode)
                                mailer.sendRegistrationConfirmationEmail(
                                    organization!!,
                                    newUser.email,
                                    verificationCode
                                )
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
                    userToChange.status != UserStatus.ACTIVE -> {
                        call.respond(HttpStatusCode.PreconditionFailed, "User is not active")
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
