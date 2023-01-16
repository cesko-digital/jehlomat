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
import model.location.Location
import model.location.LocationId
import model.location.LocationType
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
import kotlin.test.*

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
        defaultLocation = database.selectTeamById(defaultTeamId)?.locations?.first()!!

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
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/search"){
            database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
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
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/search"){
            database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser, demolishedBy = defaultUser, demolishedAt = localSec))
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(
                Json.encodeToString(
                    searchFilterRequest.copy(
                        filter = SyringeFilter(
                            locationIds = setOf(LocationId(defaultLocation.mestkaCast.toString(), LocationType.MC)),
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
    fun testSyringesFilterByAllDifferentUser() = withTestApplication(Application::module) {
        val localSec = LocalDate.now().atStartOfDay().toEpochSecond(ZoneOffset.UTC)

        val user2 = ADMIN.copy(organizationId = defaultOrgId, teamId = defaultTeamId, isAdmin = false, email = "email1@example.org")
        database.insertUser(user2)

        val token = loginUser(user2.email, user2.password)

        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/search"){
            database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser, demolishedBy = defaultUser, demolishedAt = localSec))
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")

            val json = Json.encodeToString(
                searchFilterRequest.copy(
                    filter = SyringeFilter(
                        locationIds = setOf(LocationId(defaultLocation.mestkaCast.toString(), LocationType.MC)),
                        createdAt = DateInterval(
                            from = 0,
                            to = Long.MAX_VALUE
                        ),
                        createdBy = null,
                        demolishedAt = null,
                        SyringeStatus.DEMOLISHED
                    ),
                    ordering = listOf()
                )
            )
            setBody(json)
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
    fun testExportSyringesByAll() = withTestApplication(Application::module) {
        val token = loginUser(ADMIN.email, ADMIN.password)
        val localSec = LocalDate.now().atStartOfDay().toEpochSecond(ZoneOffset.UTC)
        val id = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser, demolishedBy = defaultUser, demolishedAt = localSec))

        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/export"){
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(SyringeFilter(
                locationIds = setOf(LocationId(defaultLocation.mestkaCast.toString(), LocationType.MC)),
                createdAt = DateInterval(
                    from = 0,
                    to = 2
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
    fun testExportSyringesCreatedByAnonymous() = withTestApplication(Application::module) {
        database.insertUser(SUPER_ADMIN.copy(organizationId = defaultOrgId, teamId = defaultTeamId))
        val token = loginUser(SUPER_ADMIN.email, SUPER_ADMIN.password)
        val id = database.insertSyringe(defaultSyringe.copy(createdAt = 1))

        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/export"){
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(SyringeFilter(
                locationIds = null,
                createdAt = DateInterval(
                    from = 0,
                    to = 2
                ),
                createdBy = null,
                demolishedAt = null,
                status = null
            )))
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals("id,čas nalezení,email nálezce,jméno nálezce,email sběrače,jmeno sběrače,cas sběru,typ zničení,počet,gps,okres,městská část,obec,zneškodněno,tým,organizace\n" +
                    "$id,1,null,null,null,null,null,nezlikvidováno,10,13.3719999 49.7278823,Plzeň-město,Plzeň 3,Plzeň,NE,null,null", response.content)
        }
    }

    @Test
    fun testGetSyringe() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))
        val actualSyringes = database.selectSyringes()

        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/${actualSyringes[0].id}"){
            addHeader("Authorization", "Bearer $token")
        }) {
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
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/1"){
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals(null, response.content)
        }
    }

    @Test
    fun testGetSyringeInfo() = withTestApplication(Application::module) {
        database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))
        val actualSyringes = database.selectSyringes()

        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/${actualSyringes[0].id}/info"){
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(
                Json.encodeToString(defaultSyringe.copy(
                    id=actualSyringes[0].id,
                    createdBy = defaultUser
                ).toSyringeInfo()).replace(" ", ""),
                response.content?.replace(" ", "")?.replace("\n", ""))
        }
    }

    @Test
    fun testGetSyringeInfoNotFound() = withTestApplication(Application::module) {
        with(handleRequest(HttpMethod.Get, "$SYRINGE_API_PATH/1/info"){
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
            assertEquals(null, response.content)
        }
    }

    @Test
    fun testPutSyringe() = withTestApplication(Application::module) {
        val syringeId = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Put, SYRINGE_API_PATH) {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(defaultSyringe.copy(id = syringeId!!, createdBy = defaultUser, demolisherType = Demolisher.CITY_POLICE).toFlatObject()))
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
        val token = loginUser(USER.email, USER.password)
        val syringeId = database.insertSyringe(defaultSyringe)
        with(handleRequest(HttpMethod.Put, SYRINGE_API_PATH) {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(defaultSyringe.copy(id = syringeId!!, count = -100).toFlatObject()))
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
            assertEquals("The field count is unchangeable by PUT request.", response.content)
        }
    }

    @Test
    fun testDeleteSyringe() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Delete, "$SYRINGE_API_PATH/0"){
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals(listOf(), database.selectSyringes())
        }
    }

    @Test
    fun testPostSyringeAnonymous() = withTestApplication({ module(testing = true) }) {
        with(handleRequest(HttpMethod.Post, SYRINGE_API_PATH) {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(createRequestFromDbObject(defaultSyringe)))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(
                """{
  "id" : """" + actualSyringes[0].id + """",
  "teamAvailable" : true
}""", response.content)
            assertEquals(listOf(defaultSyringe.copy(id=actualSyringes[0].id)), actualSyringes)
        }
    }

    @Test
    fun testPostSyringeWithoutLocationAndUser() = withTestApplication({ module(testing = true) }) {
        with(handleRequest(HttpMethod.Post, SYRINGE_API_PATH) {
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(createRequestFromDbObject(defaultSyringe.copy(createdBy = null, gps_coordinates = "13.416319 49.556095"))))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(
                """{
  "id" : """" + actualSyringes[0].id + """",
  "teamAvailable" : false
}""", response.content)
        }
    }

    @Test
    fun testPostSyringeAsUser() = withTestApplication({ module(testing = true) }) {
        val token = loginUser(USER.email, USER.password)
        with(handleRequest(HttpMethod.Post, SYRINGE_API_PATH) {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(createRequestFromDbObject(defaultSyringe)))
        }) {
            assertEquals(HttpStatusCode.Created, response.status())
            val actualSyringes = database.selectSyringes()
            assertEquals(
                """{
  "id" : """" + actualSyringes[0].id + """",
  "teamAvailable" : true
}""", response.content)
            val syringeCopy = defaultSyringe.copy(
                id=actualSyringes[0].id,
                createdBy = defaultUser,
                demolished = true,
                demolishedBy = defaultUser,
                demolisherType = Demolisher.USER,
                demolishedAt = actualSyringes.first().demolishedAt)
            assertEquals(
                syringeCopy,
                actualSyringes.first())

            val org = database.selectOrganizationById(defaultOrgId)
            verify(exactly = 1) { mailerMock.sendSyringeFinding(org!!, USER.email, actualSyringes[0].id) }
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


    @Test
    fun testDemolishSyringeOk() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        val syringeId = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))!!

        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/$syringeId/demolish"){
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.NoContent, response.status())
            val demolished = database.selectSyringeById(syringeId)
            assertNotNull(demolished)
            assertTrue(demolished.demolished)
            assertEquals(defaultUser, demolished.demolishedBy)
            assertTrue(demolished.demolishedAt!! > 0)
        }
    }

    @Test
    fun testDemolishSyringeNotLoggedIn() = withTestApplication(Application::module) {
        val syringeId = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))!!

        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/$syringeId/demolish"){
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }

    @Test
    fun testDemolishSyringeAlreadyDemolished() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        val syringeId = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser, demolished = true))!!

        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/$syringeId/demolish"){
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }

    @Test
    fun testDemolishSyringeNotExist() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)

        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/not-exist/demolish"){
            addHeader("Authorization", "Bearer $token")
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    @Test
    fun testUpdateSyringeSummaryOk() = withTestApplication({ module(testing = true) }) {
        val token = loginUser(USER.email, USER.password)
        val syringeId = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser, demolished = true))!!

        with(handleRequest(HttpMethod.Put, "$SYRINGE_API_PATH/$syringeId/summary") {
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(SyringeCreateRequest(
                createdAt = 123456,
                photo = "new photo",
                count = 123,
                note = "new note",
                gps_coordinates = "13.3719999 49.7278820"
                )
            ))
        }) {
            assertEquals(HttpStatusCode.NoContent, response.status())
            val modified = database.selectSyringeById(syringeId)!!
            assertEquals(123456, modified.createdAt)
            assertEquals("new photo", modified.photo)
            assertEquals(123, modified.count)
            assertEquals("new note", modified.note)
            assertEquals("13.3719999 49.7278820", modified.gps_coordinates)
            assertEquals(554791, modified.location.obec)
        }
    }

    @Test
    fun testReserveSyringeOk() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        val reservedTill = LocalDate.now().atStartOfDay().toEpochSecond(ZoneOffset.UTC) + 86400
        val syringeId = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))!!
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/$syringeId/reserve"){
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(SyringeReserveRequest(
                reservedTill = reservedTill,
            )))
        }) {
            assertEquals(HttpStatusCode.NoContent, response.status())
            val reserved = database.selectSyringeById(syringeId)
            assertNotNull(reserved)
            assertEquals(defaultUser, reserved.reservedBy)
            assertEquals(reservedTill, reserved.reservedTill)
        }
    }

    @Test
    fun testReserveSyringeAlreadyReserved() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        val reservedTill = LocalDate.now().atStartOfDay().toEpochSecond(ZoneOffset.UTC) + 86400
        val syringeId = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser, reservedBy = defaultUser, reservedTill = reservedTill))!!
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/$syringeId/reserve"){
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(SyringeReserveRequest(
                reservedTill = reservedTill,
            )))
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }

    @Test
    fun testReserveSyringeAnonymous() = withTestApplication(Application::module) {
        val reservedTill = LocalDate.now().atStartOfDay().toEpochSecond(ZoneOffset.UTC) + 86400
        val syringeId = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))!!
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/$syringeId/reserve"){
            addHeader("Content-Type", "application/json")
            setBody(Json.encodeToString(SyringeReserveRequest(
                reservedTill = reservedTill,
            )))
        }) {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }

    @Test
    fun testReserveSyringeReservedInPast() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        val reservedTill = LocalDate.now().atStartOfDay().toEpochSecond(ZoneOffset.UTC) - 100
        val syringeId = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))!!
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/$syringeId/reserve"){
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(SyringeReserveRequest(
                reservedTill = reservedTill,
            )))
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }

    @Test
    fun testReserveSyringeTooLong() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        val reservedTill = LocalDate.now().atStartOfDay().toEpochSecond(ZoneOffset.UTC) + 86400 * 100
        val syringeId = database.insertSyringe(defaultSyringe.copy(createdBy = defaultUser))!!
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/$syringeId/reserve"){
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(SyringeReserveRequest(
                reservedTill = reservedTill,
            )))
        }) {
            assertEquals(HttpStatusCode.BadRequest, response.status())
        }
    }

    @Test
    fun testReserveSyringeNotExistent() = withTestApplication(Application::module) {
        val token = loginUser(USER.email, USER.password)
        val reservedTill = LocalDate.now().atStartOfDay().toEpochSecond(ZoneOffset.UTC) + 86400
        with(handleRequest(HttpMethod.Post, "$SYRINGE_API_PATH/abc/reserve"){
            addHeader("Content-Type", "application/json")
            addHeader("Authorization", "Bearer $token")
            setBody(Json.encodeToString(SyringeReserveRequest(
                reservedTill = reservedTill,
            )))
        }) {
            assertEquals(HttpStatusCode.NotFound, response.status())
        }
    }

    fun createRequestFromDbObject(original: Syringe): SyringeCreateRequest{
        return SyringeCreateRequest(
            createdAt = original.createdAt,
            photo = original.photo,
            count = original.count,
            note = original.note,
            gps_coordinates = original.gps_coordinates
        )
    }
}