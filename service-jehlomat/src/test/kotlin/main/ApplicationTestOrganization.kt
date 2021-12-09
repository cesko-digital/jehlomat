package main

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import model.Organization
import model.OrganizationRegistration
import model.User
import org.junit.Test
import org.mindrot.jbcrypt.BCrypt
import services.DatabaseService
import services.DatabaseServiceImpl
import kotlin.test.BeforeTest
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

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
        database.cleanUsers()
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
        val registration = OrganizationRegistration("orgName", "email@email.cz", "aaBB11aa")
        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(registration))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())

            val createdOrganization = database.selectOrganizationByName(registration.name)
            assertNotNull(createdOrganization)
            assertEquals(registration.name, createdOrganization.name)
            assertEquals(false, createdOrganization.verified)

            val createdUser = database.selectUserByEmail(registration.email)
            assertNotNull(createdUser)
            assertEquals(registration.email, createdUser.email)
            assertEquals(createdOrganization.id, createdUser.organizationId)
            assertEquals(null, createdUser.teamId)
            assertEquals(true, createdUser.isAdmin)
            assert(BCrypt.checkpw("aaBB11aa", createdUser.password))
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPostAlreadyExistingOrganization() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
            database.insertOrganization(ORGANIZATION)
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(OrganizationRegistration(ORGANIZATION.name, "email@email.cz", "aaAA11aa")))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
            assertEquals("Organization name already exists", response.content)
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPostAlreadyExistingEmail() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
            val orgId = database.insertOrganization(ORGANIZATION)
            database.insertUser(User(0, "email@email.cz", "orgName", "aaAA11aa",false, orgId, null, false))
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(OrganizationRegistration("new org", "email@email.cz", "aaAA11aa")))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
            assertEquals("E-mail already taken", response.content)
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPostWrongEmail() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
            database.insertOrganization(ORGANIZATION)
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(OrganizationRegistration("new org", "email", "aaAA11aa")))
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
            assertEquals("Wrong e-mail format", response.content)
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPostWrongPassword() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
            database.insertOrganization(ORGANIZATION)
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(OrganizationRegistration("new org", "email@email.cz", "aa")))
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
            assertEquals("Wrong password format", response.content)
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
    fun testPutOrganization(): Unit = withTestApplication(Application::module) {
        val newOrganization = ORGANIZATION.copy(name="different name")

        with(handleRequest(HttpMethod.Put, "$ORGANIZATION_API_PATH/") {
            val orgId = database.insertOrganization(ORGANIZATION)
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(newOrganization.copy(id = orgId)))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertNull(database.selectOrganizationByName(ORGANIZATION.name))
            assertNotNull(database.selectOrganizationByName(newOrganization.name))
        }
    }
}

