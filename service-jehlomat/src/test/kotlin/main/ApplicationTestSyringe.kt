package main

import TestUtils
import TestUtils.Companion.loginUser
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.server.testing.*
import io.mockk.verify
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import model.*
import model.pagination.OrderByDefinition
import model.pagination.OrderByDirection
import model.pagination.PageInfo
import model.pagination.PageInfoResult
import model.syringe.*
import model.user.UserInfo
import model.user.toUserInfo
import org.junit.Test
import services.DatabaseService
import services.MailerService
import java.time.LocalDate
import java.time.ZoneOffset
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.assertEquals

const val SYRINGE_API_PATH = "/api/v1/jehlomat/syringe"


class ApplicationTestSyringe {

    private var defaultOrgId: Int = 0
    private var defaultTeamId: Int = 0
    private var defaultUserId: Int = 0
    private var defaultUser: UserInfo? = null
    private lateinit var defaultSyringe: Syringe
    private lateinit var defaultLocation: Location
    var database: DatabaseService = DatabaseService()
    private lateinit var mailerMock:MailerService
    private val syringeFilter = SyringeFilter(setOf(), null, null, null, SyringeStatus.WAITING)
    private var searchFilterRequest = SyringeFilterRequest(
        syringeFilter,
        PageInfo(0, 10),
        listOf(OrderByDefinition(OrderBySyringeColumn.CREATED_AT, OrderByDirection.DESC))
    )
    private val ADMIN = USER.copy(isAdmin = true)

    @BeforeTest
    fun beforeEach() {
        database.cleanSyringes()
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
        defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", true))
        defaultTeamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
        defaultLocation = database.selectTeamById(defaultTeamId)?.location!!

        val user1 = ADMIN.copy(organizationId = defaultOrgId, teamId = defaultTeamId, isAdmin = true)
        defaultUserId = database.insertUser(user1)
        defaultUser = user1.copy(id = defaultUserId).toUserInfo()
        mailerMock = TestUtils.mockMailer()

        defaultSyringe = Syringe(
            "0",
            1,
            null,
            null,
            null,
            null,
            null,
            Demolisher.NO,
            photo = "",
            count = 10,
            "note",
            "13.3719999 49.7278823",
            demolished = false,
            location = defaultLocation
        )
    }

    @AfterTest
    fun afterEach() {
        database.cleanSyringes()
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
    }

    @Test
    fun testSearchSyringes() = withTestApplication(Application::module) {

        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/search"){
            database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(searchFilterRequest))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(
                Json.encodeToString(SyringeFilterResponse(
                    listOf(defaultSyringe.copy(id=actualSyringes[0].id, createdBy = defaultUser)),
                    PageInfoResult(0, 10, false)
                )).replace(" ", ""),
                response.content?.replace(" ", "")?.replace("\n", ""))
        }
    }

    @Test
    fun testSyringesFilterByAll() = withTestApplication(Application::module) {
        val localSec = LocalDate.now().atStartOfDay().toEpochSecond(ZoneOffset.UTC)
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/search"){
            database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser, demolishedBy = defaultUser, demolishedAt = localSec))
            addHeader("Content-Type", "application/json")
            setBody(
                Json.encodeToString(
                    searchFilterRequest.copy(
                        filter = SyringeFilter(
                            locationIds = setOf(defaultLocation.id),
                            createdAt = DateInterval(
                                from = 0,
                                to = Long.MAX_VALUE
                            ),
                            createdBy = SyringeFinder(
                                id = defaultUser?.id!!,
                                type = SyringeFinderType.USER
                            ),
                            demolishedAt = DateInterval(
                                from = 0,
                                to = Long.MAX_VALUE
                            ),
                            SyringeStatus.DEMOLISHED
                        ),
                        ordering = listOf(
                            OrderByDefinition(OrderBySyringeColumn.TOWN, OrderByDirection.ASC),
                            OrderByDefinition(OrderBySyringeColumn.CREATED_AT, OrderByDirection.DESC),
                            OrderByDefinition(OrderBySyringeColumn.CREATED_BY, OrderByDirection.ASC),
                        )
                    )
                )
            )
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            val actualSyringes = database.selectSyringes()

            assertEquals(
                Json.encodeToString(SyringeFilterResponse(
                    listOf(defaultSyringe.copy(id=actualSyringes[0].id, createdBy = defaultUser, demolishedAt = localSec, demolishedBy = defaultUser)),
                    PageInfoResult(0, 10, false)
                )).replace(" ", ""),
                response.content?.replace(" ", "")?.replace("\n", ""))
        }
    }

    @Test
    fun testExportSyringes() = withTestApplication(Application::module) {
        val token = loginUser(ADMIN.email, ADMIN.password)
        val id = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))

        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/export"){
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(syringeFilter))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals("id,čas nalezení,email nálezce,jméno nálezce,email sběrače,jmeno sběrače,cas sběru,typ zničení,počet,gps,okres,městská část,obec,zneškodněno,tým,organizace\n" +
                    "$id,1,email@example.org,Franta Pepa 1,null,null,null,nezlikvidováno,10,13.3719999 49.7278823,Plzeň-město,Plzeň 3,Plzeň,NE,name,defaultOrgName", response.content)
        }
    }

    @Test
    fun testExportSyringesByAll() = withTestApplication(Application::module) {
        val token = loginUser(ADMIN.email, ADMIN.password)
        val localSec = LocalDate.now().atStartOfDay().toEpochSecond(ZoneOffset.UTC)
        val id = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser, demolishedBy = defaultUser, demolishedAt = localSec))

        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/export"){
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(SyringeFilter(
                locationIds = setOf(defaultLocation.id),
                createdAt = DateInterval(
                    from = 0,
                    to = Long.MAX_VALUE
                ),
                createdBy = SyringeFinder(
                    id = defaultUser?.id!!,
                    type = SyringeFinderType.USER
                ),
                demolishedAt = DateInterval(
                    from = 0,
                    to = Long.MAX_VALUE
                ),
                SyringeStatus.DEMOLISHED
            )))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals("id,čas nalezení,email nálezce,jméno nálezce,email sběrače,jmeno sběrače,cas sběru,typ zničení,počet,gps,okres,městská část,obec,zneškodněno,tým,organizace\n" +
                    "$id,1,email@example.org,Franta Pepa 1,email@example.org,Franta Pepa 1,$localSec,nezlikvidováno,10,13.3719999 49.7278823,Plzeň-město,Plzeň 3,Plzeň,NE,name,defaultOrgName", response.content)
        }
    }

    @Test
    fun testGetSyringe() = withTestApplication(Application::module) {
        database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))
        val actualSyringes = database.selectSyringes()

        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/${actualSyringes[0].id}")) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                Json.encodeToString(defaultSyringe.copy(
                    id=actualSyringes[0].id,
                    createdBy = defaultUser
                )).replace(" ", ""),
                response.content?.replace(" ", "")?.replace("\n", ""))
        }
    }

    @Test
    fun testGetSyringeNotFound() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/1")) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals(null, response.content)
        }
    }

    @Test
    fun testPutSyringe() = withTestApplication(Application::module) {
        val syringeId = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))
        with(handleRequest(HttpMethod.Put, "$SYRINGE_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(defaultSyringe.copy(id = syringeId!!, createdBy = defaultUser, demolisherType = Demolisher.CITY_POLICE)))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(listOf(
                defaultSyringe.copy(
                    id=syringeId!!,
                    createdBy = defaultUser,
                    demolisherType = Demolisher.CITY_POLICE)),
                database.selectSyringes()
            )
        }
    }

    @Test
    fun testPutSyringeWrongChange() = withTestApplication(Application::module) {
        val syringeId = database.insertSyringe(defaultSyringe)
        with(handleRequest(HttpMethod.Put, "$SYRINGE_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(defaultSyringe.copy(id = syringeId!!, count = -100)))
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
            assertEquals("The field count is unchangeable by PUT request.", response.content)
        }
    }

    @Test
    fun testDeleteSyringe() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Delete, "$SYRINGE_API_PATH/0")) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(listOf(), database.selectSyringes())
        }
    }

    @Test
    fun testPostSyringe() = withTestApplication({ module(testing = true) }) {
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(defaultSyringe.copy(createdBy = defaultUser)))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(
                """{
  "id" : """" + actualSyringes[0].id + """",
  "teamAvailable" : true
}""", response.content)
            assertEquals(listOf(defaultSyringe.copy(id=actualSyringes[0].id, createdBy = defaultUser)), actualSyringes)

            val org = database.selectOrganizationById(defaultOrgId)
            val user = database.selectUserById(defaultUserId)
            verify(exactly = 1) { mailerMock.sendSyringeFinding(org!!, user?.email!!, actualSyringes[0].id) }
        }
    }

    @Test
    fun testPostSyringeWithWrongUser() = withTestApplication({ module(testing = true) }) {
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(defaultSyringe.copy(createdBy = UserInfo(
                id = 0, "", 0, null
            )
            )))
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }

    @Test
    fun testTrackSyringe() = withTestApplication({ module(testing = true) }) {
        val syrId = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/$syrId/track") {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(SyringeTrackingRequest(email="email@email.cz")))
        }) {
            assertEquals(HttpStatusCode.NoContent, response.status())
            verify(exactly = 1) { mailerMock.sendSyringeFindingConfirmation("email@email.cz", syrId!!) }
        }
    }
}