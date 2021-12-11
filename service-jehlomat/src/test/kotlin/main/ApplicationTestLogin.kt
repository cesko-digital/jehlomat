package main

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import model.LoginRequest
import model.Organization
import org.junit.Test
import services.DatabaseService
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

const val LOGIN_API_PATH = "/api/v1/jehlomat/login"

class ApplicationTestLogin {

    private var defaultOrgId: Int = 0
    var database: DatabaseService = DatabaseService()

    @BeforeTest
    fun beforeEach() {
        database.cleanUsers()
        database.cleanOrganizations()
        defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", true))
        database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = null))
    }

    @AfterTest
    fun afterEach() {
        database.cleanUsers()
        database.cleanOrganizations()
    }

    @Test
    fun testLoginOk(): Unit = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$LOGIN_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(LoginRequest(USER.email, USER.password)))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val jsonElement: JsonObject = Json.parseToJsonElement(response.content!!) as JsonObject
            val token = (jsonElement["token"] as JsonPrimitive).content
            assertNotNull(token)
        }
    }

    @Test
    fun testLoginNotExistedUser(): Unit = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$LOGIN_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(LoginRequest("notExisted@user.com", USER.password)))
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }

    @Test
    fun testLoginWrongPassword(): Unit = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$LOGIN_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(LoginRequest(USER.email, "wrong password")))
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }
}