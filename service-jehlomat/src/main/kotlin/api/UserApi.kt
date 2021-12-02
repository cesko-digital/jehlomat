package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.User
import model.toUserInfo
import services.DatabaseService
import utils.isValidMail
import utils.isValidPassword

fun Route.userApi(databaseInstance: DatabaseService): Route {

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
                (!newUser.password.isValidPassword()) -> {
                    call.respond(HttpStatusCode.BadRequest, "Wrong password format.")
                }
                databaseInstance.selectUserByEmail(newUser.email) != null -> {
                    call.respond(HttpStatusCode.Conflict, "E-mail already taken")
                }
                else -> {
                    databaseInstance.insertUser(newUser)
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
                    databaseInstance.updateUser(newUser)
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}