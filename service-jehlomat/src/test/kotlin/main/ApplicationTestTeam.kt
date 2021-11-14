package main

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import model.Location
import model.Organization
import model.Team
import org.junit.Test
import services.DatabaseService
import services.DatabaseServiceImpl
import kotlin.test.BeforeTest
import kotlin.test.AfterTest
import kotlin.test.assertEquals

const val TEAM_API_PATH = "/api/v1/jehlomat/team"

val TEAM = Team(
    0,
    name ="ceska jehlova",
    location = Location(0,"Tyn nad Vltavou", "Bukovina", ""),
    organizationId = 1
)


class TeamTest {
    private var defaultOrgId: Int = 0
    var database: DatabaseService = DatabaseServiceImpl()

    @BeforeTest
    fun beforeEach() {
        database.cleanTeams()
        database.cleanOrganizations()
        defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", true))
    }

    @AfterTest
    fun afterEach() {
        database.cleanTeams()
        database.cleanOrganizations()
    }
    
    @Test
    fun testGetTeam() = withTestApplication(Application::module) {
        var newTeamId = database.insertTeam(TEAM.copy(organizationId = defaultOrgId))
        with(handleRequest(HttpMethod.Get, "$TEAM_API_PATH/$newTeamId") {
        }) {
            val locationId = database.selectTeams()[0].location.id
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """{
  "id" : """ + newTeamId + """,
  "name" : "ceska jehlova",
  "location" : {
    "id" : ${locationId},
    "okres" : "Tyn nad Vltavou",
    "obec" : "Bukovina",
    "mestkaCast" : ""
  },
  "organizationId" : """ + defaultOrgId + """
}""",
                response.content
            )
        }
    }

    @Test
    fun testGetTeamNotFound() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$TEAM_API_PATH/not_existing_team")) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals(null, response.content)
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPostTeam() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$TEAM_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(TEAM.copy(organizationId = defaultOrgId)))
        }) {
            val actualTeam = database.selectTeams()[0]
            val actualLocationId = actualTeam.location.id
            assertEquals(HttpStatusCode.Created, response.status())
            assertEquals(TEAM.copy(organizationId = defaultOrgId, id = actualTeam.id, location=TEAM.location.copy(id=actualLocationId)), actualTeam)
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPostAlreadyExistingTeam() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$TEAM_API_PATH/") {
            database.insertTeam(TEAM.copy(organizationId = defaultOrgId))
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(TEAM))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPutTeamNotExists() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Put, "$TEAM_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(TEAM))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPutTeam() = withTestApplication(Application::module) {
        val newOrgId = database.insertOrganization(Organization(0, "new organization", true))
        val newTeam = TEAM.copy(organizationId = newOrgId)
        var teamId = 0

        with(handleRequest(HttpMethod.Put, "$TEAM_API_PATH/") {
            teamId = database.insertTeam(TEAM.copy(organizationId = defaultOrgId))
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(newTeam.copy(id = teamId)))
        }) {
            val actualTeams = database.selectTeams()
            val actualLocationId = actualTeams[0].location.id
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(1, actualTeams.size)
            assertEquals(listOf(newTeam.copy(id = teamId,location = newTeam.location.copy(id=actualLocationId))), actualTeams)
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPutTeamNewLocation() = withTestApplication(Application::module) {
        val newTeam = TEAM.copy(organizationId = defaultOrgId,location = Location(0, "Plzeň-město", "Plzeň", "Plzeň 3"))
        var teamId = 0
        with(handleRequest(HttpMethod.Put, "$TEAM_API_PATH/") {
            teamId = database.insertTeam(TEAM.copy(organizationId = defaultOrgId))
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(newTeam.copy(id = teamId)))
        }) {
            val actualTeams = database.selectTeams()
            val actualLocationId = actualTeams[0].location.id
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(1, actualTeams.size)
            assertEquals(listOf(newTeam.copy(id = teamId, location = newTeam.location.copy(id=actualLocationId))), actualTeams)
        }
    }
}

