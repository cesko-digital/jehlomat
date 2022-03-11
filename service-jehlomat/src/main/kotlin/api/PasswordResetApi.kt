package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import services.DatabaseService
import services.MailerService


fun Route.passwordResetApi(database: DatabaseService, mailer: MailerService): Route {
    return route("/") {
        get("/get-code/{email}") {
            val email = call.parameters["email"]

            if (email == null) { // todo invalid format
                call.respond(HttpStatusCode.BadRequest, "Invalid email")
            } else {
                // TODO: DB check, urlCode set, return urlCode; otherwise NotFound
                call.respond(HttpStatusCode.OK, email) // TODO: to test response
            }
        }

        post("/save") {
            // email
            // code
            // newPass
            call.respond(HttpStatusCode.OK, true) // TODO: to test response
        }
    }
}
