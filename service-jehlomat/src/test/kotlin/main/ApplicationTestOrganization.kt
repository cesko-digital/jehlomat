package main

import api.organizations
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import model.Organization
import model.UserInfo
import org.junit.Ignore
import org.junit.Test
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import kotlin.test.BeforeTest
import kotlin.test.assertEquals

const val ORGANIZATION_API_PATH = "/api/v1/jehlomat/organization"

val ADMINISTRATOR = UserInfo(
    email = "administrator@example.org",
    verified = true
)

val ORGANIZATION = Organization(
    name="ceska jehlova",
    administrator=ADMINISTRATOR,
    verified = false
)


class OrganizationTest {
    @BeforeTest
    fun beforeEach() {
        organizations.clear()
    }

    @Test
    fun testGetOrganization() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$ORGANIZATION_API_PATH/administrator@example.org") {
            organizations.add(ORGANIZATION)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """{
  "name" : "ceska jehlova",
  "administrator" : {
    "email" : "administrator@example.org",
    "verified" : true
  },
  "verified" : false
}""",
                response.content
            )
        }
    }

    @Test
    fun testGetOrganizationNotFound() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$API_PATH/administrator@example.org")) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals(null, response.content)
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
            assertEquals(ORGANIZATION, organizations[0])
        }
    }

    @ExperimentalSerializationApi
    @Test
    fun testPostAlreadyExistingOrganization() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
            organizations.add(ORGANIZATION)
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
        val newOrganization = ORGANIZATION.copy(name="different name")

        with(handleRequest(HttpMethod.Put, "$ORGANIZATION_API_PATH/") {
            organizations.add(ORGANIZATION)
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(newOrganization))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(listOf(newOrganization), organizations)
        }
    }
}

