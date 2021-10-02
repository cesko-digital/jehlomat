package main

import api.users
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import model.Organization
import model.User
import model.UserInfo
import org.junit.Ignore
import org.junit.Test
import kotlin.test.BeforeTest
import kotlin.test.assertEquals
import services.Mailer



val user = Organization(
    "TestOrg",
    UserInfo("bares.jakub@gmail.com", false),
    teams = listOf(),
    verified = false
)

class MailerTest {
    @BeforeTest
    fun beforeEach() {
        users.clear()
    }

    @Test
    @Ignore("Need to solve how to pass jetmail api key to application")
    fun testSend() = withTestApplication(Application::module) {
        val mailer = Mailer()
        mailer.sendRegistrationConfirmationEmail(user)
    }
}
