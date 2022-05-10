package main

import TestUtils.Companion.loginUser
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import junit.framework.TestCase.assertTrue
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import model.*
import model.user.OrgAdminVerificationRequest
import model.user.User
import model.user.UserStatus
import model.user.UserVerificationRequest
import org.junit.Test
import org.mindrot.jbcrypt.BCrypt
import services.DatabaseService
import services.MailerService
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.assertEquals


const val VERIFICATION_API_PATH = "/api/v1/jehlomat/verification"


class VerificationTest {

    private var defaultOrgId: Int = 0
    private var defaultTeamId: Int = 0
    var database: DatabaseService = DatabaseService()
    val userStab = User(
        0,
        "user@email.cz",
        "",
        "",
        UserStatus.NOT_VERIFIED,
        "verificationCode",
        0,
        null,
        false
    )
    lateinit var mailerMock: MailerService

    val orgStab = Organization(0, "defaultOrgName", false)

    @BeforeTest
    fun beforeEach() {
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
        defaultOrgId = database.insertOrganization(orgStab)
        defaultTeamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
        mailerMock = TestUtils.mockMailer()
    }

    @AfterTest
    fun afterEach() {
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
    }

    @Test
    fun testVerifyUserOk() = withTestApplication(Application::module) {
        val userId = database.insertUser(userStab.copy(organizationId = defaultOrgId))

        with(handleRequest(HttpMethod.Post, "$VERIFICATION_API_PATH/user") {
            addHeader("Content-Type", "application/json")
            setBody(
                Json.encodeToString(
                    UserVerificationRequest(userStab.verificationCode, userStab.email, "username", "aaAA11aa")
                )
            )
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val userDb = database.selectUserById(userId)!!
            assertEquals(UserStatus.ACTIVE, userDb.status)
            assertEquals("username", userDb.username)
            assertTrue(BCrypt.checkpw("aaAA11aa", userDb.password))
        }
    }

    @Test
    fun testVerifyUserWrongCode() = withTestApplication(Application::module) {
        database.insertUser(userStab.copy(organizationId = defaultOrgId))
        with(handleRequest(HttpMethod.Post, "$VERIFICATION_API_PATH/user") {
            addHeader("Content-Type", "application/json")
            setBody(
                Json.encodeToString(
                    UserVerificationRequest("wrongCode", userStab.email, "username", "aaAA11aa")
                )
            )
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @Test
    fun testVerifyUserAlreadyVerified() = withTestApplication(Application::module) {
        database.insertUser(userStab.copy(organizationId = defaultOrgId, status = UserStatus.ACTIVE))
        with(handleRequest(HttpMethod.Post, "$VERIFICATION_API_PATH/user") {
            addHeader("Content-Type", "application/json")
            setBody(
                Json.encodeToString(
                    UserVerificationRequest(userStab.verificationCode, userStab.email, "username", "aaAA11aa")
                )
            )
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @Test
    fun testVerifyUserNonexistentEmail() = withTestApplication(Application::module) {
        database.insertUser(userStab.copy(organizationId = defaultOrgId))
        with(handleRequest(HttpMethod.Post, "$VERIFICATION_API_PATH/user") {
            addHeader("Content-Type", "application/json")
            setBody(
                Json.encodeToString(
                    UserVerificationRequest(userStab.verificationCode, "wrong email", "username", "aaAA11aa")
                )
            )
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @Test
    fun testVerifyUserWrongPassword() = withTestApplication(Application::module) {
        database.insertUser(userStab.copy(organizationId = defaultOrgId))
        with(handleRequest(HttpMethod.Post, "$VERIFICATION_API_PATH/user") {
            addHeader("Content-Type", "application/json")
            setBody(
                Json.encodeToString(
                    UserVerificationRequest(userStab.verificationCode, userStab.email, "username", "aa")
                )
            )
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }

    @Test
    fun testVerifyUserUsedName() = withTestApplication(Application::module) {
        database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = null))
        database.insertUser(userStab.copy(organizationId = defaultOrgId))
        with(handleRequest(HttpMethod.Post, "$VERIFICATION_API_PATH/user") {
            addHeader("Content-Type", "application/json")
            setBody(
                Json.encodeToString(
                    UserVerificationRequest(userStab.verificationCode, userStab.email, USER.username, "aaAA11aa")
                )
            )
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }

    @Test
    fun testVerifyOrganizationNotAuth() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$VERIFICATION_API_PATH/organization?orgId=$defaultOrgId") {
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }

    @Test
    fun testVerifyOrganizationNotSuperAdmin() = withTestApplication(Application::module) {
        database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Get, "$VERIFICATION_API_PATH/organization?orgId=$defaultOrgId") {
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.Forbidden, response.status())
        }
    }

    @Test
    fun testVerifyOrganizationAsSuperAdmin() = withTestApplication({ module(testing = true) }) {
        database.insertUser(SUPER_ADMIN.copy(organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser(SUPER_ADMIN.email, SUPER_ADMIN.password)
        val orgAdminId = database.insertUser(userStab.copy(organizationId = defaultOrgId, isAdmin = true))
        val orgAdmin = database.selectUserById(orgAdminId)!!

        with(handleRequest(HttpMethod.Get, "$VERIFICATION_API_PATH/organization?orgId=$defaultOrgId") {
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertTrue(database.selectOrganizationById(defaultOrgId)!!.verified)

            io.mockk.verify(exactly = 1) {
                mailerMock.sendOrgAdminConfirmationEmail(
                    orgAdmin,
                    "defaultOrgName"
                )
            }
        }
    }

    @Test
    fun testVerifyOrgAdminOk() = withTestApplication(Application::module) {
        database.updateOrganization(orgStab.copy(id = defaultOrgId, verified = true))
        val userId = database.insertUser(userStab.copy(organizationId = defaultOrgId, isAdmin = true))

        with(handleRequest(HttpMethod.Post, "$VERIFICATION_API_PATH/org-admin") {
            addHeader("Content-Type", "application/json")
            setBody(
                Json.encodeToString(
                    OrgAdminVerificationRequest(userStab.verificationCode, userId)
                )
            )
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val userDb = database.selectUserById(userId)!!
            assertEquals(UserStatus.ACTIVE, userDb.status)
        }
    }

    @Test
    fun testVerifyOrgAdminWrongCode() = withTestApplication(Application::module) {
        database.updateOrganization(orgStab.copy(id = defaultOrgId, verified = true))
        val userId = database.insertUser(userStab.copy(organizationId = defaultOrgId, isAdmin = true))

        with(handleRequest(HttpMethod.Post, "$VERIFICATION_API_PATH/org-admin") {
            addHeader("Content-Type", "application/json")
            setBody(
                Json.encodeToString(
                    OrgAdminVerificationRequest("wronng-code", userId)
                )
            )
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @Test
    fun testVerifyOrgAdminNotExist() = withTestApplication(Application::module) {
        database.updateOrganization(orgStab.copy(id = defaultOrgId, verified = true))
        with(handleRequest(HttpMethod.Post, "$VERIFICATION_API_PATH/org-admin") {
            addHeader("Content-Type", "application/json")
            setBody(
                Json.encodeToString(
                    OrgAdminVerificationRequest(userStab.verificationCode, 123)
                )
            )
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @Test
    fun testVerifyOrgAdminAlreadyActive() = withTestApplication(Application::module) {
        database.updateOrganization(orgStab.copy(id = defaultOrgId, verified = true))
        val userId = database.insertUser(userStab.copy(organizationId = defaultOrgId, isAdmin = true, status = UserStatus.ACTIVE))

        with(handleRequest(HttpMethod.Post, "$VERIFICATION_API_PATH/org-admin") {
            addHeader("Content-Type", "application/json")
            setBody(
                Json.encodeToString(
                    OrgAdminVerificationRequest(userStab.verificationCode, userId)
                )
            )
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @Test
    fun testVerifyOrgAdminNotOrgAdmin() = withTestApplication(Application::module) {
        database.updateOrganization(orgStab.copy(id = defaultOrgId, verified = true))
        val userId = database.insertUser(userStab.copy(organizationId = defaultOrgId, isAdmin = false))

        with(handleRequest(HttpMethod.Post, "$VERIFICATION_API_PATH/org-admin") {
            addHeader("Content-Type", "application/json")
            setBody(
                Json.encodeToString(
                    OrgAdminVerificationRequest(userStab.verificationCode, userId)
                )
            )
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @Test
    fun testVerifyOrgAdminNotVerifiedOrg() = withTestApplication(Application::module) {
        val userId = database.insertUser(userStab.copy(organizationId = defaultOrgId, isAdmin = true))

        with(handleRequest(HttpMethod.Post, "$VERIFICATION_API_PATH/org-admin") {
            addHeader("Content-Type", "application/json")
            setBody(
                Json.encodeToString(
                    OrgAdminVerificationRequest(userStab.verificationCode, userId)
                )
            )
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

}

