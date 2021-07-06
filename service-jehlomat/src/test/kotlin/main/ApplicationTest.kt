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
  "demolisher" : "CITY_POLICE",
  "gps_coordinates" : "10L:10W"
}"""

    val SYRINGES_STRING = """[ $SYRINGE_STRING ]""".trimIndent()

    val SYRINGE = Syringe(
        0,
        1,
        "username",
        photo = 0,
        count = 10,
        "note",
        Demolisher.CITY_POLICE,
        "10L:10W"
    )

    @BeforeTest
    fun beforeEach() {
        syringes.clear()
    }

    @Test
    fun testSyringes() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "/api/v1/jehlomat/syringe/all")) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(SYRINGES_STRING, response.content)
        }
    }

    @Test
    fun testGetSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "/api/v1/jehlomat/syringe/0") {
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(SYRINGE_STRING, response.content)
        }
    }

    @Test
    fun testGetSyringeNotFound() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "/api/v1/jehlomat/syringe/1")) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals(null, response.content)
        }
    }

    @Test
    fun testPutSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Put, "/api/v1/jehlomat/syringe/0") {
            addHeader("Content-Type", "application/json")
            setBody(SYRINGE_STRING.replace("CITY_POLICE", "NO"))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
        }
    }

    @Test
    fun testDeleteSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Delete, "/api/v1/jehlomat/syringe/0")) {
            assertEquals(HttpStatusCode.OK, response.status())
        }
    }

    @Test
    fun testPostSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "/api/v1/jehlomat/syringe/") {
            addHeader("Content-Type", "application/json")
            setBody(SYRINGE_STRING)
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
        }
    }
}
