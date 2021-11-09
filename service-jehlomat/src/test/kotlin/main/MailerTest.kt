package main

import io.ktor.application.*
import io.ktor.server.testing.*
import model.Organization
import org.junit.Ignore
import org.junit.Test
import services.DatabaseService
import services.DatabaseServiceImpl
import services.Mailer
import kotlin.test.BeforeTest


val user = Organization(
    "TestOrg",
    "bares.jakub@gmail.com",
    "password",
    verified = false
)

class MailerTest {
    var database: DatabaseService = DatabaseServiceImpl()

    @BeforeTest
    fun beforeEach() {
        database.cleanUsers()
    }

    @Test
    @Ignore("Need to solve how to pass jetmail api key to application")
    fun testSend() = withTestApplication(Application::module) {
        val mailer = Mailer()
        mailer.sendRegistrationConfirmationEmail(user)
    }
}
