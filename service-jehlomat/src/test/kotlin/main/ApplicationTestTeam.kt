package main

import TestUtils.Companion.loginUser
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import model.Location
import model.Organization
import model.Team
import org.junit.Test
import services.DatabaseService
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.assertEquals

const val TEAM_API_PATH = "/api/v1/jehlomat/team"

val LOCATION1 = Location(0,"CZ123456", "Tyn nad Vltavou okres", 10, "Tyn nad Vltavou obec",11, "Tyn nad Vltavou mc")
val LOCATION2 = Location(id=0, okres="CZ0323", okresName = "Plzeň-město", obec=554791, obecName = "Plzeň", mestkaCast=559199, mestkaCastName = "Plzeň 9-Malesice")
val LOCATION3 = Location(id=0, okres="CZ0323", okresName = "Plzeň-město", obec=554791, obecName = "Plzeň", mestkaCast=546003, mestkaCastName = "Plzeň 3")

val TEAM = Team(
    0,
    name ="ceska jehlova",
    locations = listOf(LOCATION1, LOCATION2),
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
        val newTeamId = database.insertTeam(TEAM.copy(organizationId = defaultOrgId, locations = listOf(LOCATION1, LOCATION2)))
        with(handleRequest(HttpMethod.Get, "$TEAM_API_PATH/$newTeamId") {
            addHeader("Authorization", "Bearer $token")
        }) {
            val locationId1 = database.selectTeams().first().locations[0].id
            val locationId2 = database.selectTeams().first().locations[1].id
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """{
  "id" : """ + newTeamId + """,
  "name" : "ceska jehlova",
  "locations" : [ {
    "id" : """ + locationId1 + """,
    "okres" : """" + LOCATION1.okres + """",
    "okresName" : """" + LOCATION1.okresName + """",
    "obec" : """ + LOCATION1.obec + """,
    "obecName" : """" + LOCATION1.obecName + """",
    "mestkaCast" : """ + LOCATION1.mestkaCast + """,
    "mestkaCastName" : """" + LOCATION1.mestkaCastName + """"
  }, {
    "id" : """ + locationId2 + """,
    "okres" : """" + LOCATION2.okres + """",
    "okresName" : """" + LOCATION2.okresName + """",
    "obec" : """ + LOCATION2.obec + """,
    "obecName" : """" + LOCATION2.obecName + """",
    "mestkaCast" : """ + LOCATION2.mestkaCast + """,
    "mestkaCastName" : """" + LOCATION2.mestkaCastName + """"
  } ],
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
        with(handleRequest(HttpMethod.Post, TEAM_API_PATH) {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(TEAM.copy(organizationId = defaultOrgId)))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            val actualTeam = database.selectTeams()[0]
            val actualLocationId1 = actualTeam.locations[0].id
            val actualLocationId2 = actualTeam.locations[1].id
            assertEquals(TEAM.copy(
                organizationId = defaultOrgId,
                id = actualTeam.id,
                locations = listOf(LOCATION1.copy(id = actualLocationId1), LOCATION2.copy(id = actualLocationId2))
            ), actualTeam)
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPostTeamForbidden() = withTestApplication(Application::module) {
        val newOrg = database.insertOrganization(Organization(0, "different org", true))
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Post, TEAM_API_PATH) {
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
        with(handleRequest(HttpMethod.Post, TEAM_API_PATH) {
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
        with(handleRequest(HttpMethod.Put, TEAM_API_PATH) {
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
        val newTeam = TEAM.copy(
            id = teamId,
            name = "new name",
            organizationId = defaultOrgId,
            locations = listOf(LOCATION2, LOCATION3)
        )
        val token = loginUser(USER.email, USER.password)

        with(handleRequest(HttpMethod.Put, TEAM_API_PATH) {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(newTeam))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualTeams = database.selectTeams()
            val actualLocationId1 = actualTeams[0].locations[0].id
            val actualLocationId2 = actualTeams[0].locations[1].id

            assertEquals(1, actualTeams.size)
            assertEquals(
                listOf(
                    newTeam.copy(
                        locations = listOf(
                            LOCATION2.copy(id = actualLocationId1),
                            LOCATION3.copy(id = actualLocationId2)
                        )
                    )
                ), actualTeams
            )
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPutTeamForbidden() = withTestApplication(Application::module) {
        val newOrg = database.insertOrganization(Organization(0, "different org", true))
        val newTeam = TEAM.copy(name = "new name", organizationId = newOrg)
        val teamId = database.insertTeam(TEAM.copy(organizationId = defaultOrgId))
        val token = loginUser(USER.email, USER.password)

        with(handleRequest(HttpMethod.Put, TEAM_API_PATH) {
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
        val newTeam = TEAM.copy(organizationId = defaultOrgId,locations = listOf(
            Location(id=0, okres="CZ0323", okresName = "Plzeň-město", obec=554791, obecName = "Plzeň", mestkaCast=546003, mestkaCastName = "Plzeň 3")
        ))
        var teamId = 0
        val token = loginUser(USER.email, USER.password)

        with(handleRequest(HttpMethod.Put, TEAM_API_PATH) {
            teamId = database.insertTeam(TEAM.copy(organizationId = defaultOrgId))
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(newTeam.copy(id = teamId)))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualTeams = database.selectTeams()
            val actualLocationId = actualTeams[0].locations.first().id
            assertEquals(1, actualTeams.size)
            assertEquals(listOf(newTeam.copy(id = teamId, locations = listOf(newTeam.locations.first().copy(id=actualLocationId)))), actualTeams)
        }
    }
}

