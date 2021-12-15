package main

import TestUtils.Companion.loginUser
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import junit.framework.TestCase.assertTrue
import model.*
import org.junit.Test
import services.DatabaseService
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.assertEquals


const val VERIFICATION_API_PATH = "/api/v1/jehlomat/verification"


class VerificationTest {

    private var defaultOrgId: Int = 0
    private var defaultTeamId: Int = 0
    private var defaultUserId: Int = 0
    var database: DatabaseService = DatabaseService()

    @BeforeTest
    fun beforeEach() {
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
        defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", false))
        defaultTeamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
        defaultUserId = database.insertUser(USER.copy(organizationId = defaultOrgId, teamId = defaultTeamId))
    }

    @AfterTest
    fun afterEach() {
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
    }

    @Test
    fun testVerifyUser() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$VERIFICATION_API_PATH/user?userId=$defaultUserId") {
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertTrue(database.selectUserById(defaultUserId)!!.verified)
        }
    }

    @Test
    fun testVerifyOrganizationNotAuth() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$VERIFICATION_API_PATH/organization?orgId=$defaultOrgId") {
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }

    @Test
    fun testVerifyOrganizationNotSuperAdmin() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Get, "$VERIFICATION_API_PATH/organization?orgId=$defaultOrgId") {
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.Forbidden, response.status())
        }
    }

    @Test
    fun testVerifyOrganizationAsSuperAdmin() = withTestApplication(Application::module) {
        database.insertUser(SUPER_ADMIN.copy(organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser(SUPER_ADMIN.email, SUPER_ADMIN.password)
        with(handleRequest(HttpMethod.Get, "$VERIFICATION_API_PATH/organization?orgId=$defaultOrgId") {
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertTrue(database.selectOrganizationById(defaultOrgId)!!.verified)
        }
    }
}

