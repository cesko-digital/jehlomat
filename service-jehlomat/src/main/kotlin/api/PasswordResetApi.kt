package api

import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.password.*
import services.DatabaseService
import services.MailerService
import services.RandomIdGenerator
import services.RequestValidationWrapper.Companion.validatePasswordResetRequest
import utils.isValidPassword
import java.time.Instant


fun Route.passwordResetApi(database: DatabaseService, mailer: MailerService): Route {
    return route("/") {
        post("/send-code") {
            val request = call.receive<PasswordResetSendRequest>()
            val userToChange = database.selectUserByEmail(request.email)

            when {
                userToChange == null -> {
                    call.respond(HttpStatusCode.NotFound)
                }
                userToChange.verified.not() -> {
                    call.respond(HttpStatusCode.PreconditionFailed, "User is not verified yet")
                }
                else -> {
                    val resetUrlCode = RandomIdGenerator.generatePassResetUrlCode()

                    database.invalidateOldPassResets(userToChange.id)
                    database.insertPasswordReset(PasswordReset(
                        id = 0,
                        userId = userToChange.id,
                        code = resetUrlCode,
                        requestTime = Instant.now().epochSecond,
                        callerIp = call.request.origin.remoteHost,
                        status = PasswordResetStatus.NEW
                    ))
                    mailer.sendPassResetEmail(userToChange.email, resetUrlCode)
                    call.respond(HttpStatusCode.NoContent)
                }
            }
        }

        post("/test-code") {
            val request = call.receive<PasswordResetTestRequest>()
            val passwordReset = database.selectPasswordReset(request.code)
            val user = database.selectUserByEmail(request.email)

            if(validatePasswordResetRequest(call, passwordReset, user)) {
                call.respond(HttpStatusCode.NotFound)
            }
        }

        post("/save") {
            val request = call.receive<PasswordResetSaveRequest>()
            val passwordReset = database.selectPasswordReset(request.code)
            val user = database.selectUserByEmail(request.email)

            if (!validatePasswordResetRequest(call, passwordReset, user)) {
                return@post
            }

            if (!request.password.isValidPassword()) {
                call.respond(HttpStatusCode.BadRequest, "Wrong password format.")
                return@post
            }

            database.updatePasswordResetStatus(passwordReset?.id!!, PasswordResetStatus.UTILIZED)
            database.updateUserPassword(user?.id!!, request.password)
            call.respond(HttpStatusCode.NoContent)
        }
    }
}
