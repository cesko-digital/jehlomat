package main

import api.users
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import model.User
import model.UserInfo
import org.junit.Test
import kotlin.test.BeforeTest
import kotlin.test.assertEquals

const val API_PATH = "/api/v1/jehlomat/users"

val USER = User(
    "email@example.org",
    "passwordhash",
    false
)

val USER_INFO = UserInfo(
    "email@example.org",
    false
)

class ApplicationTest {

    @BeforeTest
    fun beforeEach() {
        users.clear()
    }

    @Test
    fun testGetUser() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$API_PATH/email@example.org") {
            users.add(USER)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """{
  "email" : "email@example.org",
  "verified" : false
}""",
                response.content
            )
        }
    }

    @Test
    fun testGetUserNotFound() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$API_PATH/not_exists_username")) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals(null, response.content)
        }
    }

    @Test
    fun testPutUser() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
            users.add(USER.copy(verified = true))
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(USER.copy(password = "new password")))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(USER.copy(password = "new password"), users[0])
        }
    }

    @Test
    fun testPutChangingNotVerifiedUser() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
            users.add(USER)
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(USER))
        }) {
            assertEquals(HttpStatusCode.PreconditionFailed, response.status())
            assertEquals("User is not verified yet", response.content)
        }
    }

    @Test
    fun testPostUser() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(USER))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            assertEquals(USER, users[0])
        }
    }

    @Test
    fun testPostAlreadyExistingUser() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$API_PATH/") {
            users.add(USER)
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(USER))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
        }
    }
}

