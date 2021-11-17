package main

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import model.*
import org.junit.Test
import services.DatabaseService
import services.DatabaseServiceImpl
import kotlin.test.BeforeTest
import kotlin.test.AfterTest
import kotlin.test.assertEquals
import io.mockk.verify
import services.MailerService

val SYRINGE = Syringe(
    "0",
    1,
    null,
    photo = "",
    count = 10,
    "note",
    Demolisher.NO,
    "13.3719999 49.7278823",
    demolished = false
)

const val SYRINGE_API_PATH = "/api/v1/jehlomat/syringe"


class ApplicationTestSyringe {

    private var defaultOrgId: Int = 0
    private var defaultTeamId: Int = 0
    private var defaultUserId: Int = 0
    var database: DatabaseService = DatabaseServiceImpl()
    lateinit var mailerMock:MailerService

    @BeforeTest
    fun beforeEach() {
        database.cleanSyringes()
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
        defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", true))
        defaultTeamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
        defaultUserId = database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = defaultTeamId, isAdmin = true))
        mailerMock = TestUtils.mockMailer()
    }

    @AfterTest
    fun afterEach() {
        database.cleanSyringes()
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
    }

    @Test
    fun testGetSyringes() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all"){
            database.insertSyringe(SYRINGE.copy(userId = defaultUserId))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(
                Json.encodeToString(listOf(SYRINGE.copy(id=actualSyringes[0].id, userId = defaultUserId, gps_coordinates = actualSyringes[0].gps_coordinates.replace(" ", "")))),
                response.content?.replace(" ", "")?.replace("\n", ""))
        }
    }

    @Test
    fun testSyringesFilterByAll() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?email=email@example.com&from=1&to=1&demolisher=NO&gps_coordinates=13.3719999 49.7278823&demolished=false"){
            database.insertSyringe(SYRINGE.copy(userId = defaultUserId))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(
                Json.encodeToString(listOf(SYRINGE.copy(id=actualSyringes[0].id, userId = defaultUserId, gps_coordinates = actualSyringes[0].gps_coordinates.replace(" ", "")))),
                response.content?.replace(" ", "")?.replace("\n", ""))
        }
    }

    @Test
    fun testSyringesFilterByGPSCoordinates() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?gps_coordinates=11.1,11.1"){
            database.insertSyringe(SYRINGE.copy(userId = defaultUserId))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByUser() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?userId=0"){
            database.insertSyringe(SYRINGE.copy(userId = defaultUserId))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByFrom() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?from=2"){
            database.insertSyringe(SYRINGE.copy(userId = defaultUserId))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByTo() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?to=0"){
            database.insertSyringe(SYRINGE.copy(userId = defaultUserId))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByDemolisher() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?demolisher=CITY_POLICE"){
            database.insertSyringe(SYRINGE.copy(userId = defaultUserId))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByDemolished() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?demolished=true"){
            database.insertSyringe(SYRINGE.copy(userId = defaultUserId))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testGetSyringe() = withTestApplication(Application::module) {
        database.insertSyringe(SYRINGE.copy(userId = defaultUserId))
        val actualSyringes = database.selectSyringes()

        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/${actualSyringes[0].id}")) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                Json.encodeToString(SYRINGE.copy(id=actualSyringes[0].id, userId = defaultUserId, gps_coordinates = actualSyringes[0].gps_coordinates.replace(" ", ""))),
                response.content?.replace(" ", "")?.replace("\n", ""))
        }
    }

    @Test
    fun testGetSyringeNotFound() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/1")) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals(null, response.content)
        }
    }

    @Test
    fun testPutSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Put, "$SYRINGE_API_PATH/") {
            addHeader("Content-Type", "application/json")
            database.insertSyringe(SYRINGE.copy(userId = defaultUserId))
            setBody(Json.encodeToString(SYRINGE.copy(userId = defaultUserId, demolisher = Demolisher.CITY_POLICE)))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(listOf(
                SYRINGE.copy(
                    id=actualSyringes[0].id,
                    userId = defaultUserId,
                    demolisher = Demolisher.CITY_POLICE)),
                database.selectSyringes()
            )
        }
    }

    @Test
    fun testDeleteSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Delete, "$SYRINGE_API_PATH/0")) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(listOf(), database.selectSyringes())
        }
    }

    @Test
    fun testPostSyringe() = withTestApplication({ module(testing = true) }) {
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(SYRINGE.copy(userId = defaultUserId)))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(
                """{
  "id" : """" + actualSyringes[0].id + """",
  "teamAvailable" : true
}""", response.content)
            assertEquals(listOf(SYRINGE.copy(id=actualSyringes[0].id, userId = defaultUserId)), actualSyringes)

            val org = database.selectOrganizationById(defaultOrgId)
            val user = database.selectUserById(defaultUserId)
            verify(exactly = 1) { mailerMock.sendSyringeFinding(org!!, user?.toUserInfo()!!, actualSyringes[0].id) }
        }
    }

    @Test
    fun testPostSyringeWithWrongUser() = withTestApplication({ module(testing = true) }) {
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(SYRINGE.copy(userId = 0)))
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }

    @Test
    fun testTrackSyringe() = withTestApplication({ module(testing = true) }) {
        val syrId = database.insertSyringe(SYRINGE.copy(userId = defaultUserId))
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/$syrId/track") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(SyringeTrackingRequest(email="email@email.cz")))
        }) {
            assertEquals(HttpStatusCode.NoContent, response.status())
            verify(exactly = 1) { mailerMock.sendSyringeFindingConfirmation("email@email.cz", syrId!!) }
        }
    }
}