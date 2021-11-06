package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.User
import model.toUserInfo
import service.DatabaseService
import utils.isValidMail

val users = mutableListOf<User>()


fun Route.userApi(databaseInstance: DatabaseService): Route {

    return route("/") {
        get("/{email}") {
            try {
                val filteredUser = users.filter { it.email == call.parameters["email"] }[0]
                call.respond(HttpStatusCode.OK, filteredUser.toUserInfo())
            } catch (ex: IndexOutOfBoundsException) {
                call.respond(HttpStatusCode.NotFound)
            }
        }

        post {
            val newUser = call.receive<User>()

            // TODO: check if values satisfy condition
            // Throw-in question:
            //  check values... e-mail for valid format?
            //  what to do next here: hash password and store in DB

            when {
                (!newUser.email.isValidMail()) -> {
                    call.respond(HttpStatusCode.BadRequest, "Wrong E-mail format.")
                }
                users.any { it.email == newUser.email } -> {
                    call.respond(HttpStatusCode.Conflict, "Email or phone number already taken")
                }
                else -> {
                    users.add(newUser.copy(verified = false))
                    databaseInstance.insertUser(newUser)
                    call.respond(HttpStatusCode.Created)
                }
            }
        }

        put {
            val newUser = call.receive<User>()
            val userToChange = users.filter { it.email == newUser.email }

            // TODO: check if values satisfy condition about email format, etc.
            when {
                userToChange.isEmpty() -> {
                    call.respond(HttpStatusCode.NotFound)
                }
                (!userToChange[0].email.isValidMail()) -> {
                    call.respond(HttpStatusCode.BadRequest, "Wrong E-mail format.")
                }
                else -> {
                    users.removeIf { it.email == newUser.email }
                    users.add(newUser)
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}