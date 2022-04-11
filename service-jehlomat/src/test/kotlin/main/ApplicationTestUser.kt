package main

import TestUtils
import TestUtils.Companion.loginUser
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import model.location.Location
import model.Organization
import model.team.Team
import model.user.User
import model.user.UserChangeRequest
import model.user.UserPasswordRequest
import model.user.UserRegistrationRequest
import org.junit.Test
import org.mindrot.jbcrypt.BCrypt
import services.DatabaseService
import services.MailerService
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.assertEquals
import kotlin.test.assertNotNull


const val API_PATH = "/api/v1/jehlomat/user"


val team = Team(
    2,
    "name",
    listOf(Location(id=0, okres="CZ0323", okresName = "Plzeň-město", obec=554791, obecName = "Plzeň", mestkaCast=546003, mestkaCastName = "Plzeň 3")),
    1,
)

val USER = User(
    3,
    "email@example.org",
    "Franta Pepa 1",
    "aaAA11aa",
    true,
    "verificationCode",
    1,
    2,
    false
)

val SUPER_ADMIN = User(
    4,
    "jehlomat@cesko.digital",
    "Super Admin",
    "aaAA11aa",
    true,
    "",
    1,
    2,
    false
)


class ApplicationTest {

    private var defaultOrgId: Int = 0
    private var defaultTeamId: Int = 0
    var database: DatabaseService = DatabaseService()
    lateinit var mailerMock: MailerService


    @BeforeTest
    fun beforeEach() {
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
        defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", true))
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
    fun testGetUser() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Get, "$API_PATH/$userId") {
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """{
  "id" : """ + userId + """,
  "username" : "Franta Pepa 1",
  "organizationId" : """ + defaultOrgId + """,
  "teamId" : """ + defaultTeamId + """,
  "isAdmin" : false
}""",
                response.content
            )
        }
    }

    @Test
    fun testGetUserNotFound() = withTestApplication(Application::module) {
        database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = null))
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Get, "$API_PATH/not_exists_username") {
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals(null, response.content)
        }
    }

    @Test
    fun testPutUserAttr() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser(USER.email, USER.password)
        val newEmail = "new@email.cz"

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/attributes") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(UserChangeRequest(teamId = defaultTeamId, username = "new name", email = newEmail)))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val user = database.selectUserByEmail(newEmail)
            assertNotNull(user)
            assertEquals(newEmail, user.email)
            assertEquals("new name", user.username)
            assertEquals(defaultTeamId, user.teamId)
        }
    }

    @Test
    fun testPutUserAttrOrgAdmin() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))
        val newTeamId = database.insertTeam(TEAM.copy(name = "new team", organizationId = defaultOrgId))
        database.insertUser(SUPER_ADMIN.copy(organizationId = defaultOrgId, teamId = defaultTeamId, isAdmin = true))
        val token = loginUser(SUPER_ADMIN.email, SUPER_ADMIN.password)

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/attributes") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(UserChangeRequest(teamId = newTeamId, username = USER.username, email = USER.email)))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val user = database.selectUserByEmail(USER.email)
            assertNotNull(user)
            assertEquals(newTeamId, user.teamId)
        }
    }

    @Test
    fun testPutUserAttrTeamNotAllowed() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))
        val newTeamId = database.insertTeam(TEAM.copy(name = "new team", organizationId = defaultOrgId))
        val token = loginUser(USER.email, USER.password)

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/attributes") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(UserChangeRequest(teamId = newTeamId, username = USER.username, email = USER.email)))
        }) {
            assertEquals(HttpStatusCode.Forbidden, response.status())
        }
    }

    @Test
    fun testPutUserAttrNotLogged() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/attributes") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(UserChangeRequest(teamId = defaultTeamId, username = USER.username, email = "new@email.cz")))
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }

    @Test
    fun testPutUserAttrByDifferentUser() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))
        database.insertUser(USER.copy(email = "different@email.cz", username = "different user", organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser("different@email.cz", USER.password)

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/attributes") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(UserChangeRequest(teamId = defaultTeamId, username = USER.username, email = "new@email.cz")))
        }) {
            assertEquals(HttpStatusCode.Forbidden, response.status())
        }
    }

    @Test
    fun testPutUserAttrIncorrectToken() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/attributes") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer asdasfasdf")
            setBody(Json.encodeToString(UserChangeRequest(teamId = defaultTeamId, username = USER.username, email = "new@email.cz")))
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }

    @Test
    fun testPutUserPassword() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser(USER.email, USER.password)
        val newPassword = "newPassword12"

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/password") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(UserPasswordRequest(oldPassword = USER.password, newPassword = newPassword)))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val user = database.selectUserByEmail(USER.email)
            assertNotNull(user)
            assert(BCrypt.checkpw(newPassword, user.password))
        }
    }

    @Test
    fun testPutUserPasswordWeakNewPassword() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser(USER.email, USER.password)

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/password") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(UserPasswordRequest(oldPassword = USER.password, newPassword = "weak")))
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }

    @Test
    fun testPutUserPasswordWrongOldPassword() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser(USER.email, USER.password)

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/password") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(UserPasswordRequest(oldPassword = "wrongPassword", newPassword = "newPassword12")))
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }

    @Test
    fun testPutUserPasswordNotLogged() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/password") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(UserPasswordRequest(oldPassword = USER.password, newPassword = "newPassword12")))
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }

    @Test
    fun testPutUserPasswordByDifferentUser() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))
        database.insertUser(USER.copy(email = "different@email.cz", username = "different user", organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser("different@email.cz", USER.password)

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/password") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(UserPasswordRequest(oldPassword = USER.password, newPassword = "newPassword12")))
        }) {
            assertEquals(HttpStatusCode.Forbidden, response.status())
        }
    }

    @Test
    fun testPutUserPasswordIncorrectToken() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/password") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer asdasfasdf")
            setBody(Json.encodeToString(UserPasswordRequest(oldPassword = USER.password, newPassword = "newPassword12")))
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }

    @Test
    fun testPostUser() = withTestApplication({ module(testing = true) }) {
        database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = null, isAdmin = true, email = "org@cesko.digital", username = "org admin"))
        val token = loginUser("org@cesko.digital", USER.password)

        val emailToTest = "email@email.email"
        with(handleRequest(HttpMethod.Post, API_PATH) {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(UserRegistrationRequest(emailToTest)))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            val createdUser = database.selectUserByEmail(emailToTest)!!
            assertEquals(defaultOrgId, createdUser.organizationId)
            assertEquals(emailToTest, createdUser.email)

            io.mockk.verify(exactly = 1) {
                mailerMock.sendRegistrationConfirmationEmail(
                    organization.copy(id=defaultOrgId, name="defaultOrgName"),
                    emailToTest,
                    createdUser.verificationCode
                )
            }
        }
    }

    @Test
    fun testPostAlreadyExistingUser() = withTestApplication(Application::module) {
        database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = null, isAdmin = true, email = "org@cesko.digital", username = "org admin"))
        val token = loginUser("org@cesko.digital", USER.password)

        with(handleRequest(HttpMethod.Post, API_PATH) {
            database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = defaultTeamId))
            addHeader("Authorization", "Bearer $token")
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(UserRegistrationRequest(USER.email)))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
        }
    }
}

