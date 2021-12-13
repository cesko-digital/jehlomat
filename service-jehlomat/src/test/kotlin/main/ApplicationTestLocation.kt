package main

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import org.junit.Test
import services.DatabaseService
import kotlin.test.assertEquals


const val LOCATION_API_PATH = "/api/v1/jehlomat/location"


class LocationTest {

    var database = DatabaseService()

    @Test
    fun testGetLocations() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$LOCATION_API_PATH?gps=13.3719999 49.7278823") {
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """[ {
  "id" : 0,
  "okres" : "CZ0323",
  "obec" : "554791",
  "mestkaCast" : "546003"
}, {
  "id" : 0,
  "okres" : "CZ0323",
  "obec" : "554791",
  "mestkaCast" : ""
}, {
  "id" : 0,
  "okres" : "CZ0323",
  "obec" : "",
  "mestkaCast" : ""
} ]""",
                response.content
            )
        }
    }

    @Test
    fun testGetLocationBadRequests() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$LOCATION_API_PATH?gps=13.3719 49.7278") {
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }
}

