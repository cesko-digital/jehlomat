package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.LoginRequest
import model.LoginResponse
import model.user.UserStatus
import org.mindrot.jbcrypt.BCrypt
import services.DatabaseService
import services.JwtManager

fun Route.loginApi(database: DatabaseService, jwtManager: JwtManager): Route {

    return route("") {
        post {
            val credentials = call.receive<LoginRequest>()

            val user = database.selectUserByEmail(credentials.email)
            if (user == null) {
                call.respond(HttpStatusCode.Unauthorized)
                return@post
            }

            if (user.status != UserStatus.ACTIVE) {
                call.respond(HttpStatusCode.Unauthorized)
                return@post
            }

            if (!BCrypt.checkpw(credentials.password, user.password)) {
                call.respond(HttpStatusCode.Unauthorized)
                return@post
            }

            call.respond(LoginResponse(jwtManager.createToken(user.id)))
        }
    }
}