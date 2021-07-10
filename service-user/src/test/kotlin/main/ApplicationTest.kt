package main

import api.users
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import model.User
import org.junit.Test
import kotlin.test.BeforeTest
import kotlin.test.assertEquals

class ApplicationTest {

    val USER_STRING = """{
  "username" : "username",
  "password" : "passwordhash",
  "email" : "email@example.org",
  "organization" : null,
  "phone_number" : "+420 123 456 789",
  "verified" : false
}"""

    val API_PATH = "/api/v1/users"

    val USER = User(
        "username",
        "passwordhash",
        "email@example.org",
        null,
        "+420 123 456 789",
        false
    )

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
            assertEquals(USER_STRING, response.content)
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
            setBody(USER_STRING.replace( "null", "\"NEW_ORGANIZATION\""))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(USER.copy(organization = "NEW_ORGANIZATION"), users[0])
        }
    }

    @Test
    fun testPutChangingNotVerifiedUser() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
            users.add(USER)
            addHeader("Content-Type", "application/json")
            setBody(USER_STRING)
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
            setBody(USER_STRING.replace( "email@example.org", "new@example.org"))
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
            setBody(USER_STRING.replace( "+420 123 456 789", "123456"))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
            assertEquals("Email or phone number already taken", response.content)
        }
    }

    @Test
    fun testPostUser() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(USER_STRING)
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
            setBody(USER_STRING)
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
        }
    }

    @Test
    fun testPostAlreadyExistingEmail() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$API_PATH/") {
            users.add(USER.copy(username="new_existing_username", phone_number = USER.phone_number + "1"))
            addHeader("Content-Type", "application/json")
            setBody(USER_STRING)
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
            setBody(USER_STRING)
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
            assertEquals("Email or phone number already taken", response.content)
        }
    }
}

