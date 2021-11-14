package main

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import model.Organization
import org.junit.Ignore
import org.junit.Test
import services.DatabaseService
import services.DatabaseServiceImpl
import kotlin.test.BeforeTest
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

const val ORGANIZATION_API_PATH = "/api/v1/jehlomat/organization"

val ORGANIZATION = Organization(
    1,
    name="ceska jehlova",
    true
)


class OrganizationTest {

    var database: DatabaseService = DatabaseServiceImpl()

    @BeforeTest
    fun beforeEach() {
        database.cleanOrganizations()
    }

    @Test
    fun testGetOrganization() = withTestApplication(Application::module) {
        val orgId = database.insertOrganization(ORGANIZATION)
        with(handleRequest(HttpMethod.Get, "$ORGANIZATION_API_PATH/$orgId") {
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """{
  "id" : """ + orgId + """,
  "name" : "ceska jehlova",
  "verified" : true
}""",
                response.content
            )
        }
    }

    @Test
    fun testGetAllOrganizations() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$ORGANIZATION_API_PATH/")) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals("[ ]", response.content)
        }
    }

    @Test
    fun testGetAllOrganizationsNotEmpty() = withTestApplication(Application::module) {
        var orgId = 0
        with(handleRequest(HttpMethod.Get, "$ORGANIZATION_API_PATH/") {
            orgId = database.insertOrganization(ORGANIZATION)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """[ {
  "id" : """.trimIndent() + orgId + """,
  "name" : "ceska jehlova",
  "verified" : true
} ]""",
                response.content)
        }
    }

    @Test
    fun testGetOrganizationNotFound() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$ORGANIZATION_API_PATH/administrator@example.org")) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals("Organization not found", response.content)
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPostOrganization(): Unit = withTestApplication({ module(testing = true) }) {
        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(ORGANIZATION))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            val actualOrganization = database.selectOrganizationByName(ORGANIZATION.name)
            assertNotNull(actualOrganization)
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPostAlreadyExistingOrganization() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
            database.insertOrganization(ORGANIZATION)
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(ORGANIZATION))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPutOrganizationNotExists() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Put, "$ORGANIZATION_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(ORGANIZATION))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @ExperimentalSerializationApi
    @Test
    @Ignore("Need to change the endpoint to use id")
    fun testPutOrganization(): Unit = withTestApplication(Application::module) {
        val newOrganization = ORGANIZATION.copy(name="different email")

        with(handleRequest(HttpMethod.Put, "$ORGANIZATION_API_PATH/") {
            database.insertOrganization(ORGANIZATION)
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(newOrganization))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val organization = database.selectOrganizationByName(ORGANIZATION.name);
            assertNotNull(organization)
        }
    }
}

