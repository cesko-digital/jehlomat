import io.ktor.http.*
import io.ktor.server.testing.*
import io.mockk.every
import io.mockk.mockk
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import main.testMailerModule
import model.LoginRequest
import services.FakeMailer
import services.MailerService
import kotlin.test.fail

class TestUtils {
    companion object {
        fun mockMailer(): MailerService {
            val mailer = mockk<FakeMailer>()
            testMailerModule = org.koin.dsl.module {
                single<MailerService> { mailer }
            };
            every { mailer.sendRegistrationConfirmationEmail(any(), any(), any()) } returns Unit
            every { mailer.sendOrganizationConfirmationEmail(any(), any()) } returns Unit
            every { mailer.sendSyringeFindingConfirmation(any(), any()) } returns Unit
            every { mailer.sendSyringeFinding(any(), any(), any()) } returns Unit

            return mailer
        }

        fun TestApplicationEngine.loginUser(email: String, password: String): String {
            with(handleRequest(HttpMethod.Post, "/api/v1/jehlomat/login/") {
                addHeader("Content-Type", "application/json")
                setBody(Json.encodeToString(LoginRequest(name = email, password = password)))
            }) {
                if (response.status() == HttpStatusCode.OK) {
                    val jsonElement: JsonObject = Json.parseToJsonElement(response.content!!) as JsonObject
                    return (jsonElement["token"] as JsonPrimitive).content
                } else {
                    fail("Cannot login test user $email")
                }
            }
        }
    }
}