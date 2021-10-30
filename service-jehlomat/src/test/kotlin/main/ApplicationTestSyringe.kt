package main

import api.syringes
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import model.Demolisher
import model.Syringe
import org.junit.Ignore
import org.junit.Test
import kotlin.test.BeforeTest
import kotlin.test.assertEquals

val SYRINGE = Syringe(
    0,
    1,
    "email@example.com",
    photo = "",
    count = 10,
    "note",
    Demolisher.NO,
    "10.0,11.0",
    demolished = false
)

const val SYRINGE_API_PATH = "/api/v1/jehlomat/syringe"


class ApplicationTestSyringe {

    @BeforeTest
    fun beforeEach() {
        syringes.clear()
    }

    @Test
    fun testGetSyringes() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all"){
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                Json.encodeToString(listOf(SYRINGE)),
                response.content?.replace(" ", "")?.replace("\n", ""))
        }
    }

    @Test
    fun testSyringesFilterByAll() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?email=email@example.com&from=1&to=1&demolisher=NO&gps_coordinates=10.0,11.0&demolished=false"){
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                Json.encodeToString(listOf(SYRINGE)),
                response.content?.replace(" ", "")?.replace("\n", ""))
        }
    }

    @Test
    fun testSyringesFilterByGPSCoordinates() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?gps_coordinates=11.1,11.1"){
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByEmail() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?email=notfound@example.com"){
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByFrom() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?from=2"){
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByTo() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?to=0"){
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByDemolisher() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?demolisher=CITY_POLICE"){
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByDemolished() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?demolished=true"){
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testGetSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/0") {
            syringes.add(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                Json.encodeToString(SYRINGE),
                response.content?.replace(" ", "")?.replace("\n", ""))
        }
    }

    @Test
    fun testGetSyringeNotFound() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/1")) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals(null, response.content)
        }
    }

    @Test
    fun testPutSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Put, "$SYRINGE_API_PATH/0") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(SYRINGE.copy(demolisher = Demolisher.CITY_POLICE)))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(listOf(SYRINGE.copy(demolisher = Demolisher.CITY_POLICE)), syringes)
        }
    }

    @Test
    fun testDeleteSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Delete, "$SYRINGE_API_PATH/0")) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(listOf<Syringe>(), syringes)
        }
    }

    @Test
    fun testPostSyringe() = withTestApplication({ module(testing = true) }) {
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(SYRINGE))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            assertEquals(listOf(SYRINGE), syringes)
        }
    }
}