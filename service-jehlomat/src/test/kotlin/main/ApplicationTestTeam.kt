package main

import TestUtils.Companion.loginUser
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
import kotlin.test.BeforeTest
import kotlin.test.AfterTest
import kotlin.test.assertEquals

const val TEAM_API_PATH = "/api/v1/jehlomat/team"

val LOCATION = Location(0,"Tyn nad Vltavou", 10, 11)

val TEAM = Team(
    0,
    name ="ceska jehlova",
    location = LOCATION,
    organizationId = 1
)


class TeamTest {
    private var defaultOrgId: Int = 0
    var database: DatabaseService = DatabaseService()

    @BeforeTest
    fun beforeEach() {
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
        defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", true))
        database.insertUser(USER.copy(verified = true, organizationId = defaultOrgId, teamId = null, isAdmin = true))
    }

    @AfterTest
    fun afterEach() {
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
    }
    
    @Test
    fun testGetTeam() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        val newTeamId = database.insertTeam(TEAM.copy(organizationId = defaultOrgId))
        with(handleRequest(HttpMethod.Get, "$TEAM_API_PATH/$newTeamId") {
            addHeader("Authorization", "Bearer $token")
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
    "obec" : 10,
    "mestkaCast" : 11
  },
  "organizationId" : """ + defaultOrgId + """
}""",
                response.content
            )
        }
    }

    @Test
    fun testGetTeamNotFound() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Get, "$TEAM_API_PATH/not_existing_team"){
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals(null, response.content)
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPostTeamOk() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Post, "$TEAM_API_PATH") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(TEAM.copy(organizationId = defaultOrgId)))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            val actualTeam = database.selectTeams()[0]
            val actualLocationId = actualTeam.location.id
            assertEquals(TEAM.copy(organizationId = defaultOrgId, id = actualTeam.id, location=TEAM.location.copy(id=actualLocationId)), actualTeam)
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPostTeamForbidden() = withTestApplication(Application::module) {
        val newOrg = database.insertOrganization(Organization(0, "different org", true))
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Post, "$TEAM_API_PATH") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(TEAM.copy(organizationId = newOrg)))
        }) {
            assertEquals(HttpStatusCode.Forbidden, response.status())
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPostAlreadyExistingTeam() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Post, "$TEAM_API_PATH") {
            database.insertTeam(TEAM.copy(organizationId = defaultOrgId))
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(TEAM))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPutTeamNotExists() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Put, "$TEAM_API_PATH") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(TEAM))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPutTeamOk() = withTestApplication(Application::module) {
        val teamId = database.insertTeam(TEAM.copy(organizationId = defaultOrgId))
        val newTeam = TEAM.copy(id = teamId, name = "new name", organizationId = defaultOrgId)
        val token = loginUser(USER.email, USER.password)

        with(handleRequest(HttpMethod.Put, "$TEAM_API_PATH") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(newTeam))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualTeams = database.selectTeams()
            val actualLocationId = actualTeams[0].location.id
            assertEquals(1, actualTeams.size)
            assertEquals(listOf(newTeam.copy(location = newTeam.location.copy(id=actualLocationId))), actualTeams)
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPutTeamForbidden() = withTestApplication(Application::module) {
        val newOrg = database.insertOrganization(Organization(0, "different org", true))
        val newTeam = TEAM.copy(name = "new name", organizationId = newOrg)
        val teamId = database.insertTeam(TEAM.copy(organizationId = defaultOrgId))
        val token = loginUser(USER.email, USER.password)

        with(handleRequest(HttpMethod.Put, "$TEAM_API_PATH") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(newTeam.copy(id = teamId)))
        }) {
            assertEquals(HttpStatusCode.Forbidden, response.status())
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPutTeamNewLocation() = withTestApplication(Application::module) {
        val newTeam = TEAM.copy(organizationId = defaultOrgId,location = Location(0, okres="CZ0323", obec=554791, mestkaCast=546003))
        var teamId = 0
        val token = loginUser(USER.email, USER.password)

        with(handleRequest(HttpMethod.Put, "$TEAM_API_PATH") {
            teamId = database.insertTeam(TEAM.copy(organizationId = defaultOrgId))
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(newTeam.copy(id = teamId)))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualTeams = database.selectTeams()
            val actualLocationId = actualTeams[0].location.id
            assertEquals(1, actualTeams.size)
            assertEquals(listOf(newTeam.copy(id = teamId, location = newTeam.location.copy(id=actualLocationId))), actualTeams)
        }
    }
}

