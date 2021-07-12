package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.User
import model.UserInfo
import model.toUser
import model.toUserInfo

val users = mutableListOf<User>()


fun Route.userApi(): Route {

    fun checkPhoneNumberOrEmailAlreadyTaken(users: List<User>, newUser: UserInfo): Boolean {
        return users.filter {
            it.phone_number == newUser.phone_number || it.email == newUser.email
        }.isNotEmpty()
    }

    return route("/") {
        get("/{username}") {
            val username = call.parameters["username"]
            try {
                val filteredUser = users.filter { it.username == username }[0]
                call.respond(HttpStatusCode.OK, filteredUser.toUserInfo())
            } catch (ex: IndexOutOfBoundsException) {
                call.respond(HttpStatusCode.NotFound)
            }
        }

        post {
            val newUser = call.receive<User>()

            // TODO: check password, email if satisfy condition
            // TODO: check if organization exists
            if (users.filter { it.username == newUser.username }.isEmpty()){
                if (checkPhoneNumberOrEmailAlreadyTaken(users, newUser.toUserInfo())) {
                    call.respond(HttpStatusCode.Conflict, "Email or phone number already taken")
                } else {
                    users.add(newUser.copy(verified = false))
                    call.respond(HttpStatusCode.Created)
                }
            } else {
                call.respond(HttpStatusCode.Conflict)
            }
        }

        put {
            val newUserInfo = call.receive<UserInfo>()
            val userToChange = users.filter { it.username == newUserInfo.username }

            // TODO: check password, email if satisfy condition
            // TODO: check if organization exists
            // TODO: check if logged user is the same like username in new user
            if (userToChange.isEmpty()) {
                call.respond(HttpStatusCode.NotFound)
            } else {
                val usersToCheck = users.filter{ it.username != newUserInfo.username }
                when {
                    checkPhoneNumberOrEmailAlreadyTaken(usersToCheck, newUserInfo) -> {
                        call.respond(HttpStatusCode.Conflict, "Email or phone number already taken")
                    }
                    userToChange[0].verified.not() -> {
                        call.respond(HttpStatusCode.PreconditionFailed, "User is not verified yet")
                    }
                    else -> {
                        users.removeIf{ it.username == newUserInfo.username }
                        users.add(newUserInfo.toUser().copy(password = userToChange[0].password))
                        call.respond(HttpStatusCode.OK)
                    }
                }
            }
        }
    }
}