package main

import io.ktor.application.*
import io.ktor.server.testing.*
import model.Organization
import model.user.UserInfo
import org.junit.Ignore
import org.junit.Test
import services.DatabaseService
import services.Mailer
import kotlin.test.BeforeTest


val organization = Organization(
    1,
    "TestOrg",
    true
)

val user = UserInfo(
    1,
    "Franta Pepa 1",
    1,
    null
)

class MailerTest {
    var database = DatabaseService()

    @BeforeTest
    fun beforeEach() {
        database.cleanUsers()
    }

    @Test
    @Ignore("Need to solve how to pass jetmail api key to application")
    fun testSend() = withTestApplication(Application::module) {
        val mailer = Mailer()
        mailer.sendOrganizationConfirmationEmail(organization, "email")
    }
}
