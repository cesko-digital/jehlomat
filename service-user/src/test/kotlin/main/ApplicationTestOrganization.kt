package main

import api.organizations
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import model.Organization
import model.UserInfo
import org.junit.Test
import kotlin.test.BeforeTest
import kotlin.test.assertEquals

const val ORGANIZATION_API_PATH = "/api/v1/jehlomat/organization"

val ADMINISTRATOR = UserInfo(
    username="administrator",
    email = "administrator@example.org",
    phone_number = null,
    verified = true
)

val ORGANIZATION = Organization(
    name="ceska jehlova",
    administrator=ADMINISTRATOR,
    location = "Prague",
    usernames = listOf()
)


class OrganizationTest {
    @BeforeTest
    fun beforeEach() {
        organizations.clear()
    }

    @Test
    fun testGetOrganization() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$ORGANIZATION_API_PATH/ceska jehlova") {
            organizations.add(ORGANIZATION)
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                """{
  "name" : "ceska jehlova",
  "administrator" : {
    "username" : "administrator",
    "email" : "administrator@example.org",
    "phone_number" : null,
    "verified" : true
  },
  "location" : "Prague",
  "usernames" : [ ]
}""",
                response.content
            )
        }
    }

    @Test
    fun testGetOrganizationNotFound() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$API_PATH/not_existing_organization")) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals(null, response.content)
        }
    }
//
//    @Test
//    fun testPutUser() = withTestApplication(Application::module) {
//        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
//            users.add(USER.copy(verified = true))
//            addHeader("Content-Type", "application/json")
//            setBody(
//                Json.encodeToString(
//                    USER_INFO.copy(email = "newemail@example.org", verified = true)))
//        }) {
//            assertEquals(HttpStatusCode.OK, response.status())
//            assertEquals(USER.copy(verified = true, email = "newemail@example.org"), users[0])
//        }
//    }
//
//    @Test
//    fun testPutChangingNotVerifiedUser() = withTestApplication(Application::module) {
//        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
//            users.add(USER)
//            addHeader("Content-Type", "application/json")
//            setBody(Json.encodeToString(USER_INFO))
//        }) {
//            assertEquals(HttpStatusCode.PreconditionFailed, response.status())
//            assertEquals("User is not verified yet", response.content)
//        }
//    }
//
//    @Test
//    fun testPutUserEmailAlreadyExists() = withTestApplication(Application::module) {
//        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
//            users.add(USER.copy(verified = true))
//            users.add(USER.copy(username="username1", email = "new@example.org"))
//            addHeader("Content-Type", "application/json")
//            setBody(Json.encodeToString(USER_INFO.copy( email ="new@example.org")))
//        }) {
//            assertEquals(HttpStatusCode.Conflict, response.status())
//            assertEquals("Email or phone number already taken", response.content)
//        }
//    }
//
//    @Test
//    fun testPutUserPhoneNumberAlreadyExists() = withTestApplication(Application::module) {
//        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
//            users.add(USER.copy(verified = true))
//            users.add(USER.copy(username="username1", phone_number = "123456"))
//            addHeader("Content-Type", "application/json")
//            setBody(Json.encodeToString(USER_INFO.copy(phone_number = "123456")))
//        }) {
//            assertEquals(HttpStatusCode.Conflict, response.status())
//            assertEquals("Email or phone number already taken", response.content)
//        }
//    }
//
//    @Test
//    fun testPutUserOrganizationNotExists() = withTestApplication(Application::module) {
//        with(handleRequest(HttpMethod.Put, "$API_PATH/") {
//            users.add(USER.copy(verified = true))
//            addHeader("Content-Type", "application/json")
//            setBody(Json.encodeToString(USER_INFO.copy(organization = "\"NEW_ORGANIZATION\"")))
//        }) {
//            assertEquals(HttpStatusCode.NotAcceptable, response.status())
//            assertEquals("Organization does not exist", response.content)
//        }
//    }
//
    @Test
    fun testPostOrganization() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(ORGANIZATION))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            assertEquals(ORGANIZATION, organizations[0])
        }
    }

    @Test
    fun testPostAlreadyExistingOrganization() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
            // new administrator to check just same organization name

            // na usera prolinkovat organizaci ?
            // nejdriv se pres api zalozi user a pak se k nemu pripoji organizace ?
            // user bude mit u sebe ulozenou organizaci
            // puvodni plan
            organizations.add(
                ORGANIZATION.copy(
                    administrator=ADMINISTRATOR.copy(
                        username="new_username",
                        email="newemail@example.org",
                        phone_number="1234567890"
                    )))
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(ORGANIZATION))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
        }
    }

    @Test
    fun testPostAlreadyExistingEmail() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
            organizations.add(
                ORGANIZATION.copy(
                    name="new_existing_username",
                    administrator=ADMINISTRATOR.copy(
                        username="new_username",
                        phone_number="1234567890"
                    )))
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(ORGANIZATION))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
            assertEquals("Email already taken", response.content)
        }
    }

    @Test
    fun testPostAlreadyExistingPhoneNumber() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Post, "$ORGANIZATION_API_PATH/") {
            organizations.add(
                ORGANIZATION.copy(
                    name="new_existing_username",
                    administrator=ADMINISTRATOR.copy(
                        username="new_username",
                        email= "new_email@example.com"
                    )))
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(ORGANIZATION))
        }) {
            assertEquals(HttpStatusCode.Conflict, response.status())
            assertEquals("Phone number already taken", response.content)
        }
    }
}

