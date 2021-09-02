package main

import api.organizations
import api.teams
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import model.Location
import model.Team
import model.UserInfo
import org.junit.Test
import kotlin.test.BeforeTest
import kotlin.test.assertEquals

const val TEAM_API_PATH = "/api/v1/jehlomat/team"

val TEAM_ADMINISTRATOR = UserInfo(
    username="administrator",
    email = "administrator@example.org",
    verified = true
)

val TEAM = Team(
    name="ceska jehlova",
    administrator=ADMINISTRATOR,
    location = Location("Jihoceske kraj", "Tyn nad Vltavou", "Bukovina", ""),
    usernames = listOf()
)


class TeamTest {
    @BeforeTest
    fun beforeEach() {
        organizations.clear()
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
  "administrator" : {
    "username" : "administrator",
    "email" : "administrator@example.org",
    "verified" : true
  },
  "location" : {
    "kraj" : "Jihoceske kraj",
    "okres" : "Tyn nad Vltavou",
    "mesto" : "Bukovina",
    "mestkaCast" : ""
  },
  "usernames" : [ ]
}""",
                response.content
            )
        }
    }

//    @Test
//    fun testGetOrganizationNotFound() = withTestApplication(Application::module) {
//        with(handleRequest(HttpMethod.Get, "$API_PATH/not_existing_organization")) {
//            assertEquals(HttpStatusCode.NotFound, response.status())
//            assertEquals(null, response.content)
//        }
//    }
//
//    @Test
//    fun testPostOrganization() = withTestApplication(Application::module) {
//        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
//            addHeader("Content-Type", "application/json")
//            setBody(Json.encodeToString(ORGANIZATION))
//        }) {
//            assertEquals(HttpStatusCode.Created, response.status())
//            assertEquals(ORGANIZATION, organizations[0])
//        }
//    }
//
//    @Test
//    fun testPostAlreadyExistingOrganization() = withTestApplication(Application::module) {
//        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
//            organizations.add(
//                ORGANIZATION.copy(
//                    administrator=ADMINISTRATOR.copy(
//                        username="new_username",
//                        email="newemail@example.org",
//                    )))
//            addHeader("Content-Type", "application/json")
//            setBody(Json.encodeToString(ORGANIZATION))
//        }) {
//            assertEquals(HttpStatusCode.Conflict, response.status())
//        }
//    }
}

