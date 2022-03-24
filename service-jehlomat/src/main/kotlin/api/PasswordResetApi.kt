package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import services.DatabaseService
import services.MailerService
import services.RandomIdGenerator
import utils.isValidMail


fun Route.passwordResetApi(database: DatabaseService, mailer: MailerService): Route {
    return route("/") {
        get("/get-code/{email}") {
            val email = call.parameters["email"]

            if (email == null || !email.isValidMail()) {
                call.respond(HttpStatusCode.BadRequest, "Invalid email")
            } else {
                val userToChange = database.selectUserByEmail(email)

                when {
                    userToChange == null -> {
                        call.respond(HttpStatusCode.NotFound)
                    }
                    userToChange.verified.not() -> {
                        call.respond(HttpStatusCode.PreconditionFailed, "User is not verified yet")
                    }
                    else -> {
                        val resetUrlCode = RandomIdGenerator.generatePassResetUrlCode()

                        database.updateUser(userToChange.copy(
                            // password = "SuperAdmin1", // TODO: why pass is being updated on every update user?
                            passResetUrlCode = resetUrlCode
                        ))

                        // TODO: create Mailjet template
                        // mailer.sendPassResetEmail(userToChange.email, resetUrlCode)

                        call.respond(HttpStatusCode.OK)
                    }
                }
            }
        }

        post("/save") {
            // TODO:
            //   get from

            // email
            // code
            // newPass

            call.respond(HttpStatusCode.OK) // TODO: to test response
        }
    }
}
