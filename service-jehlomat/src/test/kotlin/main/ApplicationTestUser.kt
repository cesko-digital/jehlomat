package main

import TestUtils
import TestUtils.Companion.loginUser
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import model.Demolisher
import model.location.Location
import model.Organization
import model.Syringe
import model.team.Team
import model.user.*
import org.junit.Test
import org.mindrot.jbcrypt.BCrypt
import services.DatabaseService
import services.MailerService
import java.time.Instant
import kotlin.test.*


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
    UserStatus.ACTIVE,
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
    UserStatus.ACTIVE,
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
    private lateinit var defaultLocation: Location

    @BeforeTest
    fun beforeEach() {
        database.cleanSyringes()
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
        database.cleanLocation()
        defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", true))
        defaultTeamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
        defaultLocation = database.selectTeamById(defaultTeamId)?.locations?.first()!!
        mailerMock = TestUtils.mockMailer()
    }

    @AfterTest
    fun afterEach() {
        database.cleanSyringes()
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
        database.cleanLocation()
    }

    @Test
    fun testGetLoggedInUser() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Get, API_PATH) {
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """{
  "id" : """ + userId + """,
  "email" : """" + USER.email + """",
  "username" : """" + USER.username + """",
  "status" : """" + USER.status + """",
  "organizationId" : """ + defaultOrgId + """,
  "teamId" : """ + defaultTeamId + """,
  "isAdmin" : false,
  "isSuperAdmin" : false
}""",
                response.content
            )
        }
    }

    @Test
    fun testGetLoggedInUserNotLogged() = withTestApplication(Application::module) {
        database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = defaultTeamId))
        with(handleRequest(HttpMethod.Get, API_PATH)) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
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
  "email" : "---",
  "teamId" : """ + defaultTeamId + """,
  "isAdmin" : false
}""",
                response.content
            )
        }
    }

    @Test
    fun testGetUserByOrgAdmin() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = defaultTeamId))
        database.insertUser(USER.copy(username = "orgAdmin", email = "orgAdminEmail", organizationId = defaultOrgId, teamId = defaultTeamId, isAdmin = true))

        val token = loginUser("orgAdminEmail", USER.password)
        with(handleRequest(HttpMethod.Get, "$API_PATH/$userId") {
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """{
  "id" : """ + userId + """,
  "username" : "Franta Pepa 1",
  "organizationId" : """ + defaultOrgId + """,
  "email" : """" + USER.email + """",
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
    fun testPutUserAttr() = withTestApplication({ module(testing = true) }) {
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))
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
            assertEquals(UserStatus.NOT_VERIFIED, user.status)
            assertNotEquals(USER.verificationCode, user.verificationCode)

            io.mockk.verify(exactly = 1) {
                mailerMock.sendRegistrationConfirmationEmail(
                    organization.copy(id=defaultOrgId, name="defaultOrgName"),
                    newEmail,
                    user.verificationCode
                )
            }
        }
    }

    @Test
    fun testPutUserAttrWithSameEmail() = withTestApplication({ module(testing = true) }) {
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser(USER.email, USER.password)

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/attributes") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(UserChangeRequest(teamId = defaultTeamId, username = "new name", email = USER.email)))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val user = database.selectUserByEmail(USER.email)
            assertNotNull(user)
            assertEquals(USER.email, user.email)
            assertEquals("new name", user.username)
            assertEquals(defaultTeamId, user.teamId)
            assertEquals(UserStatus.ACTIVE, user.status)
            assertEquals(USER.verificationCode, user.verificationCode)

            io.mockk.verify(exactly = 0) {
                mailerMock.sendRegistrationConfirmationEmail(
                    organization.copy(id=defaultOrgId, name="defaultOrgName"),
                    USER.email,
                    user.verificationCode
                )
            }
        }
    }

    @Test
    fun testPutUserAttrOrgAdmin() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))
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
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))
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
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/attributes") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(UserChangeRequest(teamId = defaultTeamId, username = USER.username, email = "new@email.cz")))
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }

    @Test
    fun testPutUserAttrByDifferentUser() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))
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
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))

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
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))
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
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))
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
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))
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
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))

        with(handleRequest(HttpMethod.Put, "$API_PATH/$userId/password") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(UserPasswordRequest(oldPassword = USER.password, newPassword = "newPassword12")))
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }

    @Test
    fun testPutUserPasswordByDifferentUser() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))
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
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))

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
        database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = null, isAdmin = true, email = "org@cesko.digital", username = "org admin"))
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
        database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = null, isAdmin = true, email = "org@cesko.digital", username = "org admin"))
        val token = loginUser("org@cesko.digital", USER.password)

        with(handleRequest(HttpMethod.Post, API_PATH) {
            database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = defaultTeamId))
            addHeader("Authorization", "Bearer $token")
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(UserRegistrationRequest(USER.email)))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
            assertEquals("""{
  "fieldName" : "email",
  "status" : "Zadaný e-mail je již obsazený."
}""", response.content)
        }
    }

    @Test
    fun testDeleteUser() = withTestApplication({ module(testing = true) }) {
        val userId = database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = defaultTeamId))
        val user = database.selectUserById(userId)
        val syringeId = database.insertSyringe(Syringe(
            "0",
            1,
            null,
            Instant.now().epochSecond + 3600,
            user?.toUserInfo(),
            null,
            null,
            Demolisher.NO,
            photo = "",
            count = 10,
            "note",
            "13.3719999 49.7278823",
            demolished = false,
            location = defaultLocation
        ))!!

        database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = null, isAdmin = true, email = "org@cesko.digital", username = "org admin"))
        val token = loginUser("org@cesko.digital", USER.password)
        with(handleRequest(HttpMethod.Delete, "$API_PATH/$userId") {
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.NoContent, response.status())
            val modifiedUser = database.selectUserByEmail(USER.email)
            assertEquals(UserStatus.DEACTIVATED, modifiedUser?.status!!)
            val syringe = database.selectSyringeById(syringeId)
            assertNull(syringe?.reservedBy)
        }
    }

    @Test
    fun testDeleteUserNotLogged() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))

        with(handleRequest(HttpMethod.Delete, "$API_PATH/$userId") {
            addHeader("Content-Type", "application/json")
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }

    @Test
    fun testDeleteUserByDifferentUser() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = defaultTeamId))
        database.insertUser(USER.copy(email = "different@email.cz", username = "different user", organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser("different@email.cz", USER.password)

        with(handleRequest(HttpMethod.Delete, "$API_PATH/$userId") {
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.Forbidden, response.status())
        }
    }

    @Test
    fun testDeleteUserNotActive() = withTestApplication(Application::module) {
        val userId = database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = defaultTeamId, status = UserStatus.NOT_VERIFIED))
        database.selectUserById(userId)

        database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = null, isAdmin = true, email = "org@cesko.digital", username = "org admin"))
        val token = loginUser("org@cesko.digital", USER.password)
        with(handleRequest(HttpMethod.Delete, "$API_PATH/$userId") {
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }
}

