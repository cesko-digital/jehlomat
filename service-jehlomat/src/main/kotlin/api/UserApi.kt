package api

import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.user.User
import model.user.UserRegistrationRequest
import model.user.toUserInfo
import services.*
import utils.isValidMail
import utils.isValidPassword

fun Route.userApi(databaseInstance: DatabaseService, jwtManager: JwtManager, mailer: MailerService): Route {

    return route("/") {
        authenticate(JWT_CONFIG_NAME) {
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

            put {
                val newUser = call.receive<User>()
                val userToChange = databaseInstance.selectUserById(newUser.id)

                when {
                    userToChange == null -> {
                        call.respond(HttpStatusCode.NotFound)
                    }
                    userToChange.verified.not() -> {
                        call.respond(HttpStatusCode.PreconditionFailed, "User is not verified yet")
                    }
                    (!userToChange.email.isValidMail()) -> {
                        call.respond(HttpStatusCode.BadRequest, "Wrong E-mail format.")
                    }
                    (!userToChange.password.isValidPassword()) -> {
                        call.respond(HttpStatusCode.BadRequest, "Wrong password format.")
                    }
                    (newUser.email != userToChange.email && databaseInstance.selectUserByEmail(newUser.email) != null) -> {
                        call.respond(HttpStatusCode.BadRequest, "E-mail already taken")
                    }
                    else -> {
                        if (!RequestValidationWrapper.validatePutObject(call, jwtManager, databaseInstance, userToChange, newUser)) {
                            return@put
                        }

                        databaseInstance.updateUser(newUser)
                        call.respond(HttpStatusCode.OK)
                    }
                }
            }
        }
    }
}