package main

import TestUtils.Companion.loginUser
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import model.location.Location
import model.Organization
import model.location.LocationId
import model.location.LocationType
import model.team.Team
import model.team.TeamRequest
import model.user.UserStatus
import org.junit.Test
import services.DatabaseService
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.assertEquals

const val TEAM_API_PATH = "/api/v1/jehlomat/team"

val LOCATION1 = Location(0,"CZ0634", "Třebíč", null, null,null, null)
val LOCATION2 = Location(id=0, okres="CZ0323", okresName = "Plzeň-město", obec=554791, obecName = "Plzeň", mestkaCast=559199, mestkaCastName = "Plzeň 9-Malesice")
val LOCATION3 = Location(id=0, okres="CZ0323", okresName = "Plzeň-město", obec=554791, obecName = "Plzeň", mestkaCast=546003, mestkaCastName = "Plzeň 3")
val LOCATION4 = Location(0,"CZ0634", "Třebíč", 591939, "Výčapy",null, null)

val TEAM = Team(
    0,
    name ="ceska jehlova",
    locations = listOf(LOCATION1,LOCATION2),
    organizationId = 1
)

val TEAM_REQUEST = TeamRequest(
    0,
    name ="ceska jehlova",
    locationIds = listOf(LocationId(LOCATION1.okres, LocationType.OKRES), LocationId(LOCATION2.mestkaCast.toString(), LocationType.MC)),
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
        database.insertUser(USER.copy(status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = null, isAdmin = true))
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
            database.selectTeams().first().locations[0].id
            database.selectTeams().first().locations[1].id
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """{
  "id" : """ + newTeamId + """,
  "name" : "ceska jehlova",
  "locationIds" : [ {
    "id" : """" + LOCATION1.okres + """",
    "type" : """" + LocationType.OKRES + """"
  }, {
    "id" : """" + LOCATION2.mestkaCast + """",
    "type" : """" + LocationType.MC + """"
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
            setBody(Json.encodeToString(TEAM_REQUEST.copy(organizationId = defaultOrgId)))
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

            assertEquals(
                """{
  "id" : """ + actualTeam.id + """,
  "name" : "ceska jehlova",
  "locations" : [ {
    "id" : """ + actualLocationId1 + """,
    "okres" : """" + LOCATION1.okres + """",
    "okresName" : """" + LOCATION1.okresName + """",
    "obec" : """ + LOCATION1.obec + """,
    "obecName" : """ + LOCATION1.obecName + """,
    "mestkaCast" : """ + LOCATION1.mestkaCast + """,
    "mestkaCastName" : """ + LOCATION1.mestkaCastName + """
  }, {
    "id" : """ + actualLocationId2 + """,
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

    @ExperimentalSerializationApi
    @Test
    fun testPostTeamForbidden() = withTestApplication(Application::module) {
        val newOrg = database.insertOrganization(Organization(0, "different org", true))
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Post, TEAM_API_PATH) {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(TEAM_REQUEST.copy(organizationId = newOrg)))
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
            setBody(Json.encodeToString(TEAM_REQUEST))
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
            setBody(Json.encodeToString(TEAM_REQUEST))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPutTeamOk() = withTestApplication(Application::module) {
        val teamId = database.insertTeam(TEAM.copy(organizationId = defaultOrgId))
        val newTeam = TEAM_REQUEST.copy(
            id = teamId,
            name = "new name",
            organizationId = defaultOrgId,
            locationIds = listOf(LocationId(LOCATION2.mestkaCast.toString(), LocationType.MC), LocationId(LOCATION3.mestkaCast.toString(), LocationType.MC))
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
            assertEquals(listOf(Team(
                id = newTeam.id,
                name = newTeam.name,
                organizationId = newTeam.organizationId,
                locations = listOf(LOCATION2.copy(id=actualLocationId1), LOCATION3.copy(actualLocationId2))
            )), actualTeams)
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPutTeamForbidden() = withTestApplication(Application::module) {
        val newOrg = database.insertOrganization(Organization(0, "different org", true))
        val newTeam = TEAM_REQUEST.copy(name = "new name", organizationId = newOrg)
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
        val newTeam = TEAM_REQUEST.copy(organizationId = defaultOrgId,locationIds = listOf(
            LocationId("546003", LocationType.MC)
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
            assertEquals(listOf(TEAM.copy(
                id = teamId,
                organizationId = defaultOrgId,
                locations = listOf(Location(id=actualLocationId, okres="CZ0323", okresName = "Plzeň-město", obec=554791, obecName = "Plzeň", mestkaCast=546003, mestkaCastName = "Plzeň 3")))
            ), actualTeams)
        }
    }

    @Test
    fun testGetUsersOk() = withTestApplication(Application::module) {
        val teamId1 = database.insertTeam(TEAM.copy(organizationId = defaultOrgId))
        val teamId2 = database.insertTeam(TEAM.copy(organizationId = defaultOrgId, name = "team2"))

        val userId1 = database.insertUser(USER.copy(username = "Lucie Modra", email = "email1", status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = teamId1))
        val userId2 = database.insertUser(USER.copy(username = "Tomas Novak", email = "email2", status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = teamId1))
        database.insertUser(USER.copy(email = "email3",status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = teamId2))
        val token = loginUser( "email1", USER.password)

        with(handleRequest(HttpMethod.Get, "$TEAM_API_PATH/$teamId1/users"){
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.OK, response.status())

            assertEquals(
                """[ {
  "id" : """ + userId1 + """,
  "username" : "Lucie Modra",
  "organizationId" : """ + defaultOrgId + """,
  "email" : "---",
  "teamId" : """ + teamId1 + """,
  "isAdmin" : false
}, {
  "id" : """ + userId2 + """,
  "username" : "Tomas Novak",
  "organizationId" : """ + defaultOrgId + """,
  "email" : "---",
  "teamId" : """ + teamId1 + """,
  "isAdmin" : false
} ]""",
                response.content)
        }
    }

    @Test
    fun testGetUsersOrgAdminOk() = withTestApplication(Application::module) {
        val teamId1 = database.insertTeam(TEAM.copy(organizationId = defaultOrgId))
        val userId1 = database.insertUser(USER.copy(username = "Lucie Modra", email = "email1", status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = teamId1))
        val userId2 = database.insertUser(USER.copy(username = "Tomas Novak", email = "email2", status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = teamId1))

        database.insertUser(USER.copy(username = "Org Admin", email = "email3", status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = null, isAdmin = true))
        val token = loginUser( "email3", USER.password)
        with(handleRequest(HttpMethod.Get, "$TEAM_API_PATH/$teamId1/users"){
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.OK, response.status())

            assertEquals(
                """[ {
  "id" : """ + userId1 + """,
  "username" : "Lucie Modra",
  "organizationId" : """ + defaultOrgId + """,
  "email" : "email1",
  "teamId" : """ + teamId1 + """,
  "isAdmin" : false
}, {
  "id" : """ + userId2 + """,
  "username" : "Tomas Novak",
  "organizationId" : """ + defaultOrgId + """,
  "email" : "email2",
  "teamId" : """ + teamId1 + """,
  "isAdmin" : false
} ]""",
                response.content)
        }
    }

    @Test
    fun testGetUsersTeamNotFound() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)

        with(handleRequest(HttpMethod.Get, "$TEAM_API_PATH/differentTeam/users"){
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("Team not found", response.content)
        }
    }

    @Test
    fun testGetUsersNotAllowed() = withTestApplication(Application::module) {
        database.insertUser(USER.copy(username = "Lucie Modra", email = "email1", status = UserStatus.ACTIVE, organizationId = defaultOrgId, teamId = null))
        val token = loginUser("email1", USER.password)

        val teamId = database.insertTeam(TEAM.copy(organizationId = defaultOrgId))

        with(handleRequest(HttpMethod.Get, "$TEAM_API_PATH/${teamId}/users"){
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.Forbidden, response.status())
        }
    }
}

