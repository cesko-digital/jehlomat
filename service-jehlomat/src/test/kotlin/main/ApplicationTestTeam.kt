package main

import api.teams
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import model.Location
import model.Organization
import model.Team
import model.UserInfo
import org.junit.Test
import kotlin.test.BeforeTest
import kotlin.test.assertEquals

const val TEAM_API_PATH = "/api/v1/jehlomat/team"

val TEAM = Team(
    name="ceska jehlova",
    location = Location(0,"Tyn nad Vltavou", "Bukovina", ""),
    organizationName = "org1"
)


class TeamTest {
    @BeforeTest
    fun beforeEach() {
        teams.clear()
    }

    @Test
    fun testGetTeam() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$TEAM_API_PATH/ceska jehlova") {
            teams.add(TEAM)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """{
  "name" : "ceska jehlova",
  "location" : {
    "id" : 0,
    "okres" : "Tyn nad Vltavou",
    "mesto" : "Bukovina",
    "mestkaCast" : ""
  },
  "organizationName" : "org1"
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
            setBody(Json.encodeToString(TEAM))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            assertEquals(TEAM, teams[0])
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPostAlreadyExistingTeam() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$TEAM_API_PATH/") {
            teams.add(TEAM)
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
        val newTeam = TEAM.copy(organizationName = "org1")

        with(handleRequest(HttpMethod.Put, "$TEAM_API_PATH/") {
            teams.add(TEAM)
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(newTeam))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(listOf(newTeam), teams)
        }
    }
}

