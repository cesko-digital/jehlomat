package main

import api.syringes
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import model.Demolisher
import model.Syringe
import org.junit.Test
import kotlin.test.BeforeTest
import kotlin.test.assertEquals

class ApplicationTest {

    val SYRINGE_STRING = """{
  "id" : 0,
  "timestamp" : 1,
  "username" : "username",
  "photo" : 0,
  "count" : 10,
  "note" : "note",
  "demolisher" : "NO",
  "gps_coordinates" : "10.0,11.0",
  "city" : "Prague"
}"""

    val SYRINGES_STRING = """[ $SYRINGE_STRING ]""".trimIndent()

    val SYRINGE = Syringe(
        0,
        1,
        "username",
        photo = 0,
        count = 10,
        "note",
        Demolisher.NO,
        "10.0,11.0",
        city="Prague"
    )

    val API_PATH = "/api/v1/jehlomat/syringe"

    @BeforeTest
    fun beforeEach() {
        syringes.clear()
    }

    @Test
    fun testSyringes() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$API_PATH/all"){
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(SYRINGES_STRING, response.content)
        }
    }

    @Test
    fun testSyringesFilterByCity() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$API_PATH/all?city=Brno"){
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByUsername() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$API_PATH/all?username=None"){
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByFrom() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$API_PATH/all?from=2"){
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByTo() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$API_PATH/all?to=0"){
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByDemolisher() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$API_PATH/all?demolisher=CITY_POLICE"){
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testGetSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$API_PATH/0") {
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(SYRINGE_STRING, response.content)
        }
    }

    @Test
    fun testGetSyringeNotFound() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$API_PATH/1")) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals(null, response.content)
        }
    }

    @Test
    fun testPutSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Put, "$API_PATH/0") {
            addHeader("Content-Type", "application/json")
            setBody(SYRINGE_STRING.replace( "NO", "CITY_POLICE"))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
        }
    }

    @Test
    fun testDeleteSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Delete, "$API_PATH/0")) {
            assertEquals(HttpStatusCode.OK, response.status())
        }
    }

    @Test
    fun testPostSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(SYRINGE_STRING)
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
        }
    }
}
