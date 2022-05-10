package main

import TestUtils
import TestUtils.Companion.loginUser
import io.ktor.http.*
import io.ktor.server.testing.*
import io.mockk.verify
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import model.Organization
import model.user.User
import model.user.UserRegistrationRequest
import model.user.UserStatus
import model.user.UserVerificationRequest
import org.junit.Test
import services.DatabaseService
import services.MailerService
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.assertEquals

const val COMMON_API_PATH = "/api/v1/jehlomat/"

class ApplicationTestWorkflows {

    private var defaultOrgId: Int = 0
    var database: DatabaseService = DatabaseService()
    var mailerMock: MailerService = TestUtils.mockMailer()

    @BeforeTest
    fun beforeEach() {
        database.cleanUsers()
        database.cleanOrganizations()
        defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", true))
    }

    @AfterTest
    fun afterEach() {
        database.cleanUsers()
        database.cleanOrganizations()
    }

    @Test
    fun testFullRegistration() = withTestApplication({ module(testing = true) }) {
        // create org admin
        database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = null, isAdmin = true, email = "org@cesko.digital", username = "org admin"))
        val token = loginUser("org@cesko.digital", USER.password)

        // register a new user
        val emailToTest = "email@email.email"
        var createdUser:User
        with(handleRequest(HttpMethod.Post, "$COMMON_API_PATH/user") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(UserRegistrationRequest(emailToTest)))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            createdUser = database.selectUserByEmail(emailToTest)!!
            assertEquals(defaultOrgId, createdUser.organizationId)
            assertEquals(emailToTest, createdUser.email)

            verify(exactly = 1) {
                mailerMock.sendRegistrationConfirmationEmail(
                    organization.copy(id=defaultOrgId, name="defaultOrgName"),
                    emailToTest,
                    createdUser.verificationCode
                )
            }
        }

        // verify the created user
        with(handleRequest(HttpMethod.Post, "$COMMON_API_PATH/verification/user") {
            addHeader("Content-Type", "application/json")
            setBody(
                Json.encodeToString(
                    UserVerificationRequest(createdUser.verificationCode, emailToTest, "newUserName", "aaAA11aa")
                )
            )
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
        }
    }
}