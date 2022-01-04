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
        with(handleRequest(HttpMethod.Get, "$LOCATION_API_PATH/point?gps=13.3719999 49.7278823") {
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """[ {
  "id" : 0,
  "okres" : "CZ0323",
  "obec" : 554791,
  "mestkaCast" : 546003
}, {
  "id" : 0,
  "okres" : "CZ0323",
  "obec" : 554791,
  "mestkaCast" : -1
}, {
  "id" : 0,
  "okres" : "CZ0323",
  "obec" : -1,
  "mestkaCast" : -1
} ]""",
                response.content
            )
        }
    }

    @Test
    fun testGetLocationBadRequests() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$LOCATION_API_PATH/point?gps=13.3719 49.7278") {
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }

    @Test
    fun testGetLocationAll() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$LOCATION_API_PATH/all") {
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals("""
                [ {
                  "id" : "CZ0323",
                  "name" : "Plzeň-město",
                  "type" : "okres"
                }, {
                  "id" : "CZ0324",
                  "name" : "Plzeň-jih",
                  "type" : "okres"
                }, {
                  "id" : "CZ0325",
                  "name" : "Plzeň-sever",
                  "type" : "okres"
                }, {
                  "id" : "500852",
                  "name" : "Bohuňovice",
                  "type" : "obec"
                }, {
                  "id" : "591939",
                  "name" : "Výčapy",
                  "type" : "obec"
                }, {
                  "id" : "591319",
                  "name" : "Opatov",
                  "type" : "obec"
                }, {
                  "id" : "550001",
                  "name" : "Vrcovice",
                  "type" : "obec"
                }, {
                  "id" : "554791",
                  "name" : "Plzeň",
                  "type" : "obec"
                }, {
                  "id" : "545970",
                  "name" : "Plzeň 1",
                  "type" : "mc"
                }, {
                  "id" : "545988",
                  "name" : "Plzeň 2-Slovany",
                  "type" : "mc"
                }, {
                  "id" : "546003",
                  "name" : "Plzeň 3",
                  "type" : "mc"
                }, {
                  "id" : "546208",
                  "name" : "Plzeň 4",
                  "type" : "mc"
                }, {
                  "id" : "559199",
                  "name" : "Plzeň 9-Malesice",
                  "type" : "mc"
                }, {
                  "id" : "554731",
                  "name" : "Plzeň 5-Křimice",
                  "type" : "mc"
                }, {
                  "id" : "554758",
                  "name" : "Plzeň 6-Litice",
                  "type" : "mc"
                }, {
                  "id" : "554766",
                  "name" : "Plzeň 7-Radčice",
                  "type" : "mc"
                } ]
            """.trimIndent(), response.content)
        }
    }
}

