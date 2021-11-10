package main

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import model.Organization
import org.junit.Test
import org.mindrot.jbcrypt.BCrypt
import services.DatabaseService
import services.DatabaseServiceImpl
import kotlin.test.BeforeTest
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

const val ORGANIZATION_API_PATH = "/api/v1/jehlomat/organization"

val ORGANIZATION = Organization(
    name="ceska jehlova",
    email="email@example.org",
    password="password",
    verified = false
)


class OrganizationTest {

    var database: DatabaseService = DatabaseServiceImpl()

    @BeforeTest
    fun beforeEach() {
        database.cleanOrganizations()
    }

    @Test
    fun testGetOrganization() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$ORGANIZATION_API_PATH/ceska jehlova") {
            database.insertOrganization(ORGANIZATION)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """{
  "name" : "ceska jehlova",
  "email" : "email@example.org",
  "password" : "",
  "verified" : false
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
        with(handleRequest(HttpMethod.Get, "$ORGANIZATION_API_PATH/") {
            database.insertOrganization(ORGANIZATION)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals("""
                [ {
                  "name" : "ceska jehlova",
                  "email" : "email@example.org",
                  "password" : "",
                  "verified" : false
                } ]
            """.trimIndent(), response.content)
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
    fun testPostOrganization() = withTestApplication({ module(testing = true) }) {
        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(ORGANIZATION))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            val actualOrganization = database.selectOrganizationByName(ORGANIZATION.name)
            assertNotNull(actualOrganization)
            assertEquals(ORGANIZATION.email, actualOrganization.email)
            assert(BCrypt.checkpw(ORGANIZATION.password, actualOrganization.password))
            assertEquals(ORGANIZATION.verified, actualOrganization.verified)
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
    fun testPutOrganization() = withTestApplication(Application::module) {
        val newOrganization = ORGANIZATION.copy(email="different email")

        with(handleRequest(HttpMethod.Put, "$ORGANIZATION_API_PATH/") {
            database.insertOrganization(ORGANIZATION)
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(newOrganization))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val organization = database.selectOrganizationByName(ORGANIZATION.name);
            assertNotNull(organization)
            assertEquals(newOrganization.email, organization.email)
            assert(BCrypt.checkpw(newOrganization.password, organization.password))
            assertEquals(ORGANIZATION.verified, organization.verified)
        }
    }
}

