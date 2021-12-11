package api

import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.User
import model.toUserInfo
import services.*
import utils.isValidMail
import utils.isValidPassword
import utils.isValidUsername

fun Route.userApi(databaseInstance: DatabaseService, jwtManager: JwtManager, mailer: MailerService): Route {

    return route("/") {
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
            val newUser = call.receive<User>()

            when {
                (!newUser.email.isValidMail()) -> {
                    call.respond(HttpStatusCode.BadRequest, "Wrong E-mail format.")
                }
                (!newUser.username.isValidUsername()) -> {
                    call.respond(HttpStatusCode.BadRequest, "Wrong username format.")
                }
                (!newUser.password.isValidPassword()) -> {
                    call.respond(HttpStatusCode.BadRequest, "Wrong password format.")
                }
                databaseInstance.selectUserByEmail(newUser.email) != null -> {
                    call.respond(HttpStatusCode.Conflict, "E-mail already taken")
                }
                else -> {
                    val userId = databaseInstance.insertUser(newUser)
                    val organization = databaseInstance.selectOrganizationById(newUser.organizationId)

                    if (organization == null) {
                        call.respond(HttpStatusCode.NotFound, "Organization not found")
                    } else {
                        mailer.sendRegistrationConfirmationEmail(organization, newUser.copy(id=userId).toUserInfo())
                        call.respond(HttpStatusCode.Created)
                    }
                }
            }
        }

        authenticate(JWT_CONFIG_NAME) {
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