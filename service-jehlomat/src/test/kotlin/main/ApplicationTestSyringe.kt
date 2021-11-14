package main

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import model.Demolisher
import model.Syringe
import org.junit.Test
import services.DatabaseService
import services.DatabaseServiceImpl
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

    var database: DatabaseService = DatabaseServiceImpl()

    @BeforeTest
    fun beforeEach() {
        database.cleanSyringes()
    }
    @Test
    fun testGetSyringes() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all"){
            database.insertSyringe(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(
                Json.encodeToString(listOf(SYRINGE.copy(id=actualSyringes[0].id))),
                response.content?.replace(" ", "")?.replace("\n", ""))
        }
    }

    @Test
    fun testSyringesFilterByAll() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?email=email@example.com&from=1&to=1&demolisher=NO&gps_coordinates=10.0,11.0&demolished=false"){
            database.insertSyringe(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(
                Json.encodeToString(listOf(SYRINGE.copy(id=actualSyringes[0].id))),
                response.content?.replace(" ", "")?.replace("\n", ""))
        }
    }

    @Test
    fun testSyringesFilterByGPSCoordinates() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?gps_coordinates=11.1,11.1"){
            database.insertSyringe(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByEmail() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?email=notfound@example.com"){
            database.insertSyringe(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByFrom() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?from=2"){
            database.insertSyringe(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByTo() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?to=0"){
            database.insertSyringe(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByDemolisher() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?demolisher=CITY_POLICE"){
            database.insertSyringe(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testSyringesFilterByDemolished() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/all?demolished=true"){
            database.insertSyringe(SYRINGE)
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testGetSyringe() = withTestApplication(Application::module) {
        database.insertSyringe(SYRINGE)
        val actualSyringes = database.selectSyringes()

        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/${actualSyringes[0].id}")) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                Json.encodeToString(SYRINGE.copy(id=actualSyringes[0].id)),
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
        with(handleRequest(HttpMethod.Put, "$SYRINGE_API_PATH/") {
            addHeader("Content-Type", "application/json")
            database.insertSyringe(SYRINGE)
            setBody(Json.encodeToString(SYRINGE.copy(demolisher = Demolisher.CITY_POLICE)))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(listOf(
                SYRINGE.copy(
                    id=actualSyringes[0].id,
                    demolisher = Demolisher.CITY_POLICE)),
                database.selectSyringes()
            )
        }
    }

    @Test
    fun testDeleteSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Delete, "$SYRINGE_API_PATH/0")) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(listOf(), database.selectSyringes())
        }
    }

    @Test
    fun testPostSyringe() = withTestApplication({ module(testing = true) }) {
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(SYRINGE))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(listOf(SYRINGE.copy(id=actualSyringes[0].id)), actualSyringes)
        }
    }
}