package main

import TestUtils
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import io.mockk.verify
import junit.framework.TestCase
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import model.Organization
import model.password.*
import org.junit.Test
import org.mindrot.jbcrypt.BCrypt
import services.DatabaseService
import services.MailerService
import java.time.Instant
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.assertEquals

const val PASSWORD_RESET_API_PATH = "/api/v1/jehlomat/password-reset"
const val PASSWORD_CODE = "password_code"

class ApplicationTestPasswordReset {

    private var defaultOrgId: Int = 0
    private var defaultUserId: Int = 0
    var database: DatabaseService = DatabaseService()
    private lateinit var mailerMock: MailerService


    @BeforeTest
    fun beforeEach() {
        database.cleanPasswordResets()
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
        defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", true))
        defaultUserId = database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = null))

        mailerMock = TestUtils.mockMailer()
    }

    @AfterTest
    fun afterEach() {
        database.cleanPasswordResets()
        database.cleanUsers()
        database.cleanOrganizations()
    }

    @Test
    fun testSendCodeOk() = withTestApplication({ module(testing = true) }) {
        database.insertPasswordReset(PasswordReset(0, defaultUserId, "OLD_RESET", "", 0, PasswordResetStatus.NEW))

        with(handleRequest(HttpMethod.Post, "$PASSWORD_RESET_API_PATH/send-code") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(PasswordResetSendRequest(email = USER.email)))
        }) {
            assertEquals(HttpStatusCode.NoContent, response.status())

            val resets = database.selectPasswordResets();
            assertEquals(PasswordResetStatus.OLDER, resets[0].status)

            assertEquals(defaultUserId, resets[1].userId)
            assertEquals(PasswordResetStatus.NEW, resets[1].status)
            verify(exactly = 1) { mailerMock.sendPassResetEmail(USER.email, defaultUserId, resets[1].code) }
        }
    }

    @Test
    fun testSendCodeNotExisted() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$PASSWORD_RESET_API_PATH/send-code") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(PasswordResetSendRequest(email = "wrong-email")))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @Test
    fun testSendTestCodeOk() = withTestApplication(Application::module) {
        database.insertPasswordReset(PasswordReset(0, defaultUserId, PASSWORD_CODE, "", Instant.now().epochSecond, PasswordResetStatus.NEW))

        with(handleRequest(HttpMethod.Post, "$PASSWORD_RESET_API_PATH/test-code") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(PasswordResetTestRequest(userId = defaultUserId, code = PASSWORD_CODE)))
        }) {
            assertEquals(HttpStatusCode.NoContent, response.status())
        }
    }

    @Test
    fun testSavePasswordOk() = withTestApplication(Application::module) {
        database.insertPasswordReset(PasswordReset(0, defaultUserId, PASSWORD_CODE, "", Instant.now().epochSecond, PasswordResetStatus.NEW))
        val newPassword = "noveHeslo1234"

        with(handleRequest(HttpMethod.Post, "$PASSWORD_RESET_API_PATH/save") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(PasswordResetSaveRequest(userId = defaultUserId, code = PASSWORD_CODE, password = newPassword)))
        }) {
            assertEquals(HttpStatusCode.NoContent, response.status())
            val resets = database.selectPasswordResets();
            assertEquals(PasswordResetStatus.UTILIZED, resets[0].status)

            val userDb = database.selectUserById(defaultUserId)!!
            TestCase.assertTrue(BCrypt.checkpw(newPassword, userDb.password))
        }
    }

    @Test
    fun testSavePasswordWrongUser() = withTestApplication(Application::module) {
        database.insertPasswordReset(PasswordReset(0, defaultUserId, PASSWORD_CODE, "", Instant.now().epochSecond, PasswordResetStatus.NEW))

        with(handleRequest(HttpMethod.Post, "$PASSWORD_RESET_API_PATH/save") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(PasswordResetSaveRequest(userId = 123456, code = PASSWORD_CODE, password ="aaBB11aa")))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @Test
    fun testSavePasswordWrongCode() = withTestApplication(Application::module) {
        database.insertPasswordReset(PasswordReset(0, defaultUserId, PASSWORD_CODE, "", Instant.now().epochSecond, PasswordResetStatus.NEW))

        with(handleRequest(HttpMethod.Post, "$PASSWORD_RESET_API_PATH/save") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(PasswordResetSaveRequest(userId = defaultUserId, code = "wrong-code", password ="aaBB11aa")))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @Test
    fun testSavePasswordDifferentUser() = withTestApplication(Application::module) {
        database.insertPasswordReset(PasswordReset(0, defaultUserId, PASSWORD_CODE, "", Instant.now().epochSecond, PasswordResetStatus.NEW))
        val superAdminId = database.insertUser(SUPER_ADMIN.copy(organizationId = defaultOrgId, teamId = null))

        with(handleRequest(HttpMethod.Post, "$PASSWORD_RESET_API_PATH/save") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(PasswordResetSaveRequest(userId = superAdminId, code = PASSWORD_CODE, password ="aaBB11aa")))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @Test
    fun testSavePasswordUsedReset() = withTestApplication(Application::module) {
        database.insertPasswordReset(PasswordReset(0, defaultUserId, PASSWORD_CODE, "", Instant.now().epochSecond, PasswordResetStatus.UTILIZED))

        with(handleRequest(HttpMethod.Post, "$PASSWORD_RESET_API_PATH/save") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(PasswordResetSaveRequest(userId = defaultUserId, code = PASSWORD_CODE, password ="aaBB11aa")))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @Test
    fun testSavePasswordOldReset() = withTestApplication(Application::module) {
        database.insertPasswordReset(PasswordReset(0, defaultUserId, PASSWORD_CODE, "", 1, PasswordResetStatus.NEW))

        with(handleRequest(HttpMethod.Post, "$PASSWORD_RESET_API_PATH/save") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(PasswordResetSaveRequest(userId = defaultUserId, code = PASSWORD_CODE, password ="aaBB11aa")))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @Test
    fun testSavePasswordWrongPassword() = withTestApplication(Application::module) {
        database.insertPasswordReset(PasswordReset(0, defaultUserId, PASSWORD_CODE, "", Instant.now().epochSecond, PasswordResetStatus.NEW))

        with(handleRequest(HttpMethod.Post, "$PASSWORD_RESET_API_PATH/save") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(PasswordResetSaveRequest(userId = defaultUserId, code = PASSWORD_CODE, password ="aa")))
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }
}