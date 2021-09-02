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
    "username",
    "passwordhash",
    "email@example.org",
    "+420123456789",
    false
)

val USER_INFO = UserInfo(
    "username",
    "email@example.org",
    "+420123456789",
    false
)

class ApplicationTest {
    @BeforeTest
    fun beforeEach() {
        users.clear()
    }

    @Test
    fun testGetUser() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$API_PATH/username") {
            users.add(USER)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """{
  "username" : "username",
  "email" : "email@example.org",
  "phone_number" : "+420123456789",
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
            setBody(
                Json.encodeToString(
                    USER_INFO.copy(email = "newemail@example.org", verified = true)))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(USER.copy(verified = true, email = "newemail@example.org"), users[0])
        }
    }

    @Test
    fun testPutChangingNotVerifiedUser() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
            users.add(USER)
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(USER_INFO))
        }) {
            assertEquals(HttpStatusCode.PreconditionFailed, response.status())
            assertEquals("User is not verified yet", response.content)
        }
    }

    @Test
    fun testPutUserEmailAlreadyExists() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
            users.add(USER.copy(verified = true))
            users.add(USER.copy(username="username1", email = "new@example.org"))
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(USER_INFO.copy( email ="new@example.org")))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
            assertEquals("Email or phone number already taken", response.content)
        }
    }

    @Test
    fun testPutUserPhoneNumberAlreadyExists() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
            users.add(USER.copy(verified = true))
            users.add(USER.copy(username="username1", phone_number = "123456"))
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(USER_INFO.copy(phone_number = "123456")))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
            assertEquals("Email or phone number already taken", response.content)
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

    @Test
    fun testPostAlreadyExistingEmail() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$API_PATH/") {
            users.add(USER.copy(username="new_existing_username", phone_number = USER.phone_number + "1"))
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(USER))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
            assertEquals("Email or phone number already taken", response.content)
        }
    }

    @Test
    fun testPostAlreadyExistingPhoneNumber() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$API_PATH/") {
            users.add(USER.copy(username = "new_existing_username", email = USER.email + "1"))
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(USER))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
            assertEquals("Email or phone number already taken", response.content)
        }
    }
}

