package main

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import model.Demolisher
import model.Organization
import model.Syringe
import org.junit.Test
import services.DatabaseService
import services.DatabaseServiceImpl
import kotlin.test.BeforeTest
import kotlin.test.AfterTest
import kotlin.test.assertEquals

val SYRINGE = Syringe(
    0,
    1,
    0,
    photo = "",
    count = 10,
    "note",
    Demolisher.NO,
    "10.0,11.0",
    demolished = false
)

const val SYRINGE_API_PATH = "/api/v1/jehlomat/syringe"


class ApplicationTestSyringe {

    private var defaultOrgId: Int = 0
    private var defaultTeamId: Int = 0
    var database: DatabaseService = DatabaseServiceImpl()

    @BeforeTest
    fun beforeEach() {
        database.cleanSyringes()
        database.cleanTeams()
        database.cleanOrganizations()
        defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName"))
        defaultTeamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
    }

    @AfterTest
    fun afterEach() {
        database.cleanSyringes()
        database.cleanTeams()
        database.cleanOrganizations()
    }

    @Test
    fun testGetSyringes() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all"){
            database.insertSyringe(SYRINGE.copy(teamId = defaultTeamId))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(
                Json.encodeToString(listOf(SYRINGE.copy(id=actualSyringes[0].id, teamId = defaultTeamId))),
                response.content?.replace(" ", "")?.replace("\n", ""))
        }
    }

    @Test
    fun testSyringesFilterByAll() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?email=email@example.com&from=1&to=1&demolisher=NO&gps_coordinates=10.0,11.0&demolished=false"){
            database.insertSyringe(SYRINGE.copy(teamId = defaultTeamId))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(
                Json.encodeToString(listOf(SYRINGE.copy(id=actualSyringes[0].id, teamId = defaultTeamId))),
                response.content?.replace(" ", "")?.replace("\n", ""))
        }
    }

    @Test
    fun testSyringesFilterByGPSCoordinates() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?gps_coordinates=11.1,11.1"){
            database.insertSyringe(SYRINGE.copy(teamId = defaultTeamId))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByEmail() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?teamId=20"){
            database.insertSyringe(SYRINGE.copy(teamId = defaultTeamId))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByFrom() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?from=2"){
            database.insertSyringe(SYRINGE.copy(teamId = defaultTeamId))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByTo() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?to=0"){
            database.insertSyringe(SYRINGE.copy(teamId = defaultTeamId))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByDemolisher() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?demolisher=CITY_POLICE"){
            database.insertSyringe(SYRINGE.copy(teamId = defaultTeamId))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByDemolished() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?demolished=true"){
            database.insertSyringe(SYRINGE.copy(teamId = defaultTeamId))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testGetSyringe() = withTestApplication(Application::module) {
        database.insertSyringe(SYRINGE.copy(teamId = defaultTeamId))
        val actualSyringes = database.selectSyringes()

        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/${actualSyringes[0].id}")) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                Json.encodeToString(SYRINGE.copy(id=actualSyringes[0].id, teamId = defaultTeamId)),
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
            database.insertSyringe(SYRINGE.copy(teamId = defaultTeamId))
            setBody(Json.encodeToString(SYRINGE.copy(teamId = defaultTeamId, demolisher = Demolisher.CITY_POLICE)))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(listOf(
                SYRINGE.copy(
                    id=actualSyringes[0].id,
                    teamId = defaultTeamId,
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
            setBody(Json.encodeToString(SYRINGE.copy(teamId = defaultTeamId)))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(listOf(SYRINGE.copy(id=actualSyringes[0].id, teamId = defaultTeamId)), actualSyringes)
        }
    }
}