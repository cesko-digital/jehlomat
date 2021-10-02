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
import services.Mailer



val user = UserInfo(
    "email@example.org",
    false
)

class MailerTest {
    @BeforeTest
    fun beforeEach() {
        users.clear()
    }

    @Test
    fun testSend() = withTestApplication(Application::module) {
        val mailer = Mailer()
        mailer.sendRegistrationConfirmationEmail(user)
    }
}
