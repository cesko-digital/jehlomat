import api.SyringeTable
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
import org.junit.Assert
import org.ktorm.expression.ArgumentExpression
import org.ktorm.expression.SelectExpression
import org.ktorm.schema.ColumnDeclaring
import services.DatabaseService
import services.FakeMailer
import services.MailerService
import java.time.LocalDateTime
import java.time.ZoneOffset
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
            every { mailer.sendPassResetEmail(any(), any(), any()) } returns Unit
            every { mailer.sendOrgAdminConfirmationEmail(any(), any()) } returns Unit

            return mailer
        }

        fun TestApplicationEngine.loginUser(email: String, password: String): String {
            with(handleRequest(HttpMethod.Post, "/api/v1/jehlomat/login") {
                addHeader("Content-Type", "application/json")
                setBody(Json.encodeToString(LoginRequest(email = email, password = password)))
            }) {
                if (response.status() == HttpStatusCode.OK) {
                    val jsonElement: JsonObject = Json.parseToJsonElement(response.content!!) as JsonObject
                    return (jsonElement["token"] as JsonPrimitive).content
                } else {
                    fail("Cannot login test user $email")
                }
            }
        }

        fun valueIsAlmostNow(value: Long) {
            val nowSecond = LocalDateTime.now().toEpochSecond(ZoneOffset.UTC)
            Assert.assertTrue(value == nowSecond || value == nowSecond + 1)
        }

        fun generateSql(dsl: ColumnDeclaring<Boolean>, database: DatabaseService): Pair<String, List<ArgumentExpression<*>>> {
            val visitor = database.createSqlFormatter()
            visitor.visit(
                SelectExpression(
                where=dsl.asExpression(),
                from= SyringeTable.asExpression()
            )
            )
            return Pair(visitor.sql, visitor.parameters)
        }
    }
}