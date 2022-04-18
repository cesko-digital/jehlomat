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
  "okresName" : "Plzeň-město",
  "obec" : null,
  "obecName" : null,
  "mestkaCast" : null,
  "mestkaCastName" : null
}, {
  "id" : 0,
  "okres" : "CZ0323",
  "okresName" : "Plzeň-město",
  "obec" : 554791,
  "obecName" : "Plzeň",
  "mestkaCast" : null,
  "mestkaCastName" : null
}, {
  "id" : 0,
  "okres" : "CZ0323",
  "okresName" : "Plzeň-město",
  "obec" : 554791,
  "obecName" : "Plzeň",
  "mestkaCast" : 546003,
  "mestkaCastName" : "Plzeň 3"
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
                  "type" : "OKRES"
                }, {
                  "id" : "CZ0324",
                  "name" : "Plzeň-jih",
                  "type" : "OKRES"
                }, {
                  "id" : "CZ0325",
                  "name" : "Plzeň-sever",
                  "type" : "OKRES"
                }, {
                  "id" : "500852",
                  "name" : "Bohuňovice",
                  "type" : "OBEC"
                }, {
                  "id" : "591939",
                  "name" : "Výčapy",
                  "type" : "OBEC"
                }, {
                  "id" : "591319",
                  "name" : "Opatov",
                  "type" : "OBEC"
                }, {
                  "id" : "550001",
                  "name" : "Vrcovice",
                  "type" : "OBEC"
                }, {
                  "id" : "554791",
                  "name" : "Plzeň",
                  "type" : "OBEC"
                }, {
                  "id" : "545970",
                  "name" : "Plzeň 1",
                  "type" : "MC"
                }, {
                  "id" : "545988",
                  "name" : "Plzeň 2-Slovany",
                  "type" : "MC"
                }, {
                  "id" : "546003",
                  "name" : "Plzeň 3",
                  "type" : "MC"
                }, {
                  "id" : "546208",
                  "name" : "Plzeň 4",
                  "type" : "MC"
                }, {
                  "id" : "559199",
                  "name" : "Plzeň 9-Malesice",
                  "type" : "MC"
                }, {
                  "id" : "554731",
                  "name" : "Plzeň 5-Křimice",
                  "type" : "MC"
                }, {
                  "id" : "554758",
                  "name" : "Plzeň 6-Litice",
                  "type" : "MC"
                }, {
                  "id" : "554766",
                  "name" : "Plzeň 7-Radčice",
                  "type" : "MC"
                } ]
            """.trimIndent(), response.content)
        }
    }

    @Test
    fun testGetGeomMissingOkOkres() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$LOCATION_API_PATH/geometry?id=CZ0323&type=okres") {
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
        }
    }

    @Test
    fun testGetGeomMissingOkObec() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$LOCATION_API_PATH/geometry?id=554791&type=obec") {
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
        }
    }

    @Test
    fun testGetGeomMissingOkMc() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$LOCATION_API_PATH/geometry?id=554766&type=mc") {
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
        }
    }

    @Test
    fun testGetGeomWringIdType() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$LOCATION_API_PATH/geometry?id=55a4766&type=mc") {
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }

    @Test
    fun testGetGeomMissingId() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$LOCATION_API_PATH/geometry?type=obec") {
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }

    @Test
    fun testGetGeomMissingType() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$LOCATION_API_PATH/geometry?id=123") {
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }

    @Test
    fun testGetGeomWrongType() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$LOCATION_API_PATH/geometry?id=123&type=wrongType") {
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }
}

