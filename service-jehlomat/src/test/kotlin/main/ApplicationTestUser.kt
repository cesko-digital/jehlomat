package main

import TestUtils
import TestUtils.Companion.loginUser
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import model.*
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
    Location(0,okres="CZ0323", obec="554791", mestkaCast="546003"),
    1,
)

val USER = User(
    3,
    "email@example.org",
    "Franta Pepa 1",
    "aaAA11aa",
    false,
    1,
    2,
    false
)

val SUPER_ADMIN = User(
    4,
    "super@admin.cz",
    "Super Admin",
    "aaAA11aa",
    false,
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
        with(handleRequest(HttpMethod.Get, "$API_PATH/$userId") {
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """{
  "id" : """ + userId + """,
  "email" : "email@example.org",
  "username" : "Franta Pepa 1",
  "verified" : false,
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
        with(handleRequest(HttpMethod.Get, "$API_PATH/not_exists_username")) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals(null, response.content)
        }
    }

    @Test
    fun testPutUser() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser(USER.email, USER.password)

        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(
                Json.encodeToString(
                    USER.copy(
                        verified = true,
                        username = "new name",
                        password = "new password",
                        id = userId,
                        organizationId = defaultOrgId,
                        teamId = defaultTeamId
                    )
                )
            )
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val user = database.selectUserByEmail(USER.email)
            assertNotNull(user)
            assertEquals(USER.email, user.email)
            assert(BCrypt.checkpw("new password", user.password))
            assertEquals("new name", user.username)
        }
    }

    @Test
    fun testPutUserNotLogged() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))

        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(USER.copy(password = "new password", id = userId, organizationId = defaultOrgId, teamId = defaultTeamId)))
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }

    @Test
    fun testPutUserByDifferentUser() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))
        database.insertUser(USER.copy(email = "different@email.cz", username = "different user", organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser("different@email.cz", USER.password)

        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(USER.copy(verified = true, password = "new password", id = userId, organizationId = defaultOrgId, teamId = defaultTeamId)))
        }) {
            assertEquals(HttpStatusCode.Forbidden, response.status())
        }
    }

    @Test
    fun testPutUserIncorrectToken() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = defaultTeamId))

        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer asdasfasdf")
            setBody(Json.encodeToString(USER.copy(password = "new password", id = userId, organizationId = defaultOrgId, teamId = defaultTeamId)))
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }


    @Test
    fun testPostUser() = withTestApplication({ module(testing = true) }) {
        with(handleRequest(HttpMethod.Post, "$API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(USER.copy(organizationId = defaultOrgId, teamId = defaultTeamId)))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            val actualUser = database.selectUserByEmail(USER.email)
            io.mockk.verify(exactly = 1) {
                mailerMock.sendRegistrationConfirmationEmail(
                    organization.copy(id=defaultOrgId, name="defaultOrgName"),
                    actualUser!!.toUserInfo().copy(id=actualUser.id)
                )
            }
        }
    }

    @Test
    fun testPostAlreadyExistingUser() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$API_PATH/") {
            database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = defaultTeamId))
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(USER))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
        }
    }
}

