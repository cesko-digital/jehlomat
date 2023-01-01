package services

import main.SUPER_ADMIN
import main.team
import model.*
import model.location.Location
import model.location.LocationId
import model.location.LocationType
import model.syringe.*
import model.team.Team
import model.user.User
import model.user.UserStatus
import model.user.toUserInfo
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.mindrot.jbcrypt.BCrypt
import java.time.LocalDate
import java.time.ZoneOffset
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class DatabaseServiceTest {

    var database: DatabaseService = DatabaseService()
    var defaultOrgId: Int = 0

    @Before
    fun beforeEach() {
        database.cleanSyringes()
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
        database.cleanLocation()
        defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", true))
    }

    @After
    fun afterEach() {
        database.cleanSyringes()
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
        database.cleanLocation()
    }

    @Test
    fun testGetObec() {
        val actualObec = database.getObec("17.2825351 49.6602072")
        assertEquals(500852, actualObec?.id?.toInt())
    }

    @Test
    fun testGetMC() {
        val actualObec = database.getMC("13.3719999 49.7278823")
        assertEquals(546003, actualObec?.id?.toInt())
    }

    @Test
    fun testGetOkres() {
        val actualObec = database.getOkres("13.3719999 49.7278823")
        assertEquals("CZ0323", actualObec?.id)
    }

    @Test
    fun testGetNone() {
        val actualObec = database.getObec("00.0000000 00.0000000")
        assertNull(actualObec)
    }

    @Test
    fun testSelectUserByEmail() {
        assertNull(database.selectUserByEmail("not-existent-user"))

        database.insertUser(User(0, "email", "Franta Pepa 1", "password", UserStatus.NOT_VERIFIED, "", defaultOrgId, null, false))

        val user = database.selectUserByEmail("email")
        assertNotNull(user)
        assertEquals("email", user.email)
        assertNotNull(user.password)
        assertEquals(UserStatus.NOT_VERIFIED, user.status)
    }

    @Test
    fun testHashingUserPassword() {
        val originalPassword = "original-password"
        database.insertUser(User(0, "email","Franta Pepa 1", originalPassword, UserStatus.NOT_VERIFIED, "", defaultOrgId, null, false))

        val user = database.selectUserByEmail("email")
        assertNotNull(user)
        assertNotEquals(originalPassword, user.password)
        assert(BCrypt.checkpw(originalPassword, user.password))

        val newPassword = "new-password"
        database.updateUser(User(user.id, "email", "Franta Pepa 1", newPassword, UserStatus.NOT_VERIFIED, "", defaultOrgId, null, false))

        val updatedUser = database.selectUserByEmail("email")
        assertNotNull(updatedUser)
        assertNotEquals(originalPassword, updatedUser.password)
        assert(BCrypt.checkpw(newPassword, updatedUser.password))
    }

    @Test
    fun testResolveNearestTeam() {
        val exactTeamLocation = Location(id=0, okres="CZ0323", okresName = "Plzeň-město", obec=554791, obecName = "Plzeň", mestkaCast=546003, mestkaCastName = "Plzeň 3")
        val exactTeam = Team(0,"teamA", listOf(exactTeamLocation), defaultOrgId)

        val obecTeamLocation = Location(id=0, okres="CZ0323", okresName = "Plzeň-město", obec=554791, obecName = "Plzeň", mestkaCast=559199, mestkaCastName = "Plzeň 9-Malesice")
        val obecTeam = Team(0, "teamB", listOf(obecTeamLocation), defaultOrgId)

        val exactTeamId = database.insertTeam(exactTeam)
        database.insertTeam(obecTeam)

        val actualTeam = database.resolveNearestTeam("13.3719999 49.7278823")
        // update ID because of DB auto incementation
        val expectedTeam = exactTeam.copy(locations=listOf(exactTeamLocation.copy(id=actualTeam!!.locations.first().id )), id = exactTeamId)

        assertEquals(expectedTeam, actualTeam)
    }

    @Test
    fun testSelectSyringes() {
        val teamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
        val selectTeamById = database.selectTeamById(teamId)
        val loc = selectTeamById?.locations?.first()!!
        val user = User(0, "email", "password", "Franta Pepa 1", UserStatus.ACTIVE, "", defaultOrgId, null, false)
        val userId = database.insertUser(user)
        val userInfo = user.copy(id = userId).toUserInfo()
        val syringeToCreate = Syringe("", 0, userInfo, null, null, null, null,Demolisher.USER,"", 1, "", "", loc, false)
        val syringeId = database.insertSyringe(syringeToCreate)

        val syringeFilter = SyringeFilter(
            locationIds = setOf(LocationId(loc.mestkaCast.toString(), LocationType.MC)),
            createdAt = DateInterval(0, 1),
            createdBy = null,
            demolishedAt=null,
            status = SyringeStatus.WAITING
        )

        val selectedSyringes = database.selectSyringes(syringeFilter, SyringeRoleLimitation(database, setOf(Role.OrgAdmin), user))
        assertEquals(
            listOf(
                CSVExportSchema(
                    syringeId!!,
                    0,
                    user.email,
                    user.username,
                    null,
                    null,
                    null,
                    "nálezce",
                    syringeToCreate.count,
                    syringeToCreate.gps_coordinates,
                    "Plzeň-město",
                    "Plzeň 3",
                    "Plzeň",
                    "NE",
                    null,
                    "defaultOrgName"
                )
            ), selectedSyringes)
    }
    @Test
    fun testSelectSyringesOnlyFromAUser() {
        val teamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
        val selectTeamById = database.selectTeamById(teamId)
        val loc = selectTeamById?.locations?.first()!!
        val user = User(0, "email", "password", "Franta Pepa 1", UserStatus.ACTIVE, "", defaultOrgId, teamId, false)
        val userId = database.insertUser(user)
        val userInfo = user.copy(id = userId).toUserInfo()
        val syringeToCreate = Syringe("", 0, userInfo, null, null, null, null,Demolisher.USER,"", 1, "", "", loc, false)
        val syringeId = database.insertSyringe(syringeToCreate)

        val user2 = User(1, "email1", "password", "Franta Pepa 2", UserStatus.ACTIVE, "", defaultOrgId, teamId, false)
        val userId2 = database.insertUser(user2)
        val user2WithId = user2.copy(id = userId2)

        val syringeFilter = SyringeFilter(
            locationIds = setOf(LocationId(loc.mestkaCast.toString(), LocationType.MC)),
            createdAt = DateInterval(0, LocalDate.now().atStartOfDay().toEpochSecond(ZoneOffset.UTC)),
            createdBy = SyringeFinder(userId, SyringeFinderType.USER),
            demolishedAt=null,
            status = SyringeStatus.WAITING
        )

        val selectedSyringes = database.selectSyringes(syringeFilter, SyringeRoleLimitation(database, setOf(Role.UserOwner), user.copy(id=userId)))
        assertEquals(
            listOf(
                CSVExportSchema(
                    syringeId!!,
                    0,
                    user.email,
                    user.username,
                    null,
                    null,
                    null,
                    "nálezce",
                    syringeToCreate.count,
                    syringeToCreate.gps_coordinates,
                    "Plzeň-město",
                    "Plzeň 3",
                    "Plzeň",
                    "NE",
                    "name",
                    "defaultOrgName"
                )
            ), selectedSyringes)

        val selectedSyringes2 = database.selectSyringes(
            syringeFilter.copy(createdBy = SyringeFinder(userId2, SyringeFinderType.USER)),
            SyringeRoleLimitation(database, setOf(Role.UserOwner), user2WithId)
        )
        assertEquals(listOf(), selectedSyringes2)
    }

    @Test
    fun testSelectSyringesBySuperAdminButDateNotMatches() {
        val teamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
        val selectTeamById = database.selectTeamById(teamId)
        val loc = selectTeamById?.locations?.first()!!
        val user = User(0, "email", "password", "Franta Pepa 1", UserStatus.ACTIVE, "", defaultOrgId, null, false)
        val userId = database.insertUser(user)
        val userInfo = user.copy(id = userId).toUserInfo()
        val syringeToCreate = Syringe("", 0, userInfo, null, null, null, null,Demolisher.USER,"", 1, "", "", loc, false)
        database.insertSyringe(syringeToCreate)

        assertEquals(listOf(), database.selectSyringes(
            SyringeFilter(
                locationIds = setOf(LocationId(loc.mestkaCast.toString(), LocationType.MC)),
                createdAt = DateInterval(1, 2),
                createdBy = null,
                demolishedAt=null,
                status = SyringeStatus.WAITING
            ),
            SyringeRoleLimitation(database, setOf(Role.SuperAdmin), SUPER_ADMIN)
        ))
    }

    @Test
    fun testSelectSyringesBySuperAdminButCreatedAtNotMatches() {
        val teamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
        val selectTeamById = database.selectTeamById(teamId)
        val loc = selectTeamById?.locations?.first()!!
        val user = User(0, "email", "password", "Franta Pepa 1", UserStatus.ACTIVE, "", defaultOrgId, null, false)
        val userId = database.insertUser(user)
        val userInfo = user.copy(id = userId).toUserInfo()
        val syringeToCreate = Syringe("", 0, userInfo, null, null, null, null,Demolisher.USER,"", 1, "", "", loc, false)
        database.insertSyringe(syringeToCreate)

        assertEquals(listOf(), database.selectSyringes(
            SyringeFilter(
                locationIds = setOf(LocationId(loc.mestkaCast.toString(), LocationType.MC)),
                createdAt = DateInterval(0, 1),
                createdBy = SyringeFinder(0, SyringeFinderType.USER),
                demolishedAt = null,
                status = SyringeStatus.WAITING
            ),
            SyringeRoleLimitation(database, setOf(Role.SuperAdmin), SUPER_ADMIN)
        ))
    }

    @Test
    fun testInsertAndUpdateSyringe() {
        val teamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
        val selectTeamById = database.selectTeamById(teamId)
        val loc = selectTeamById?.locations?.first()!!
        val user = User(0, "email", "password", "Franta Pepa 1", UserStatus.ACTIVE, "", defaultOrgId, null, false)
        val userId = database.insertUser(user)
        val userInfo = user.copy(id = userId).toUserInfo()

        val syringeToCreate1 = Syringe("", 0, userInfo, null, null, null, null, Demolisher.USER,"", 1, "first", "", loc, false)
        val syringeId1 = database.insertSyringe(syringeToCreate1)

        assertNotNull(syringeId1)
        val createdSyringe = database.selectSyringeById(syringeId1)
        assertEquals(syringeToCreate1.copy(id = syringeId1), createdSyringe)

        var syringeToCreate2 = Syringe("", 0, userInfo, null, null, null, null, Demolisher.USER,"", 2, "second", "", loc, false)
        val syringeId2 = database.insertSyringe(syringeToCreate2)
        syringeToCreate2 = syringeToCreate2.copy(id = syringeId2!!, count = 5)
        database.updateSyringe(syringeToCreate2.toFlatObject())

        assertEquals(1, database.selectSyringeById(syringeId1)?.count)
        assertEquals(5, database.selectSyringeById(syringeId2)?.count)
    }

    @Test
    fun testSelectAllLocations() {
        assertEquals(
            listOf(
                Location(id=0, okres="CZ0323", okresName = "Plzeň-město", obec=null, obecName = null, mestkaCast=null, mestkaCastName = null),
                Location(id=0, okres="CZ0323", okresName = "Plzeň-město", obec=554791, obecName = "Plzeň", mestkaCast=null, mestkaCastName = null),
                Location(id=0, okres="CZ0323", okresName = "Plzeň-město", obec=554791, obecName = "Plzeň", mestkaCast=546003, mestkaCastName = "Plzeň 3")
            ),
            database.getLocationCombinations("13.3719999 49.7278823")
        )
    }

    @Test
    fun testGetLocations() {
        assertEquals(
            listOf(
                mapOf("id" to "CZ0323", "name" to "Plzeň-město", "type" to "OKRES"),
                mapOf("id" to "CZ0324", "name" to "Plzeň-jih", "type" to "OKRES"),
                mapOf("id" to "CZ0325", "name" to "Plzeň-sever", "type" to "OKRES"),
                mapOf("id" to "500852", "name" to "Bohuňovice", "type" to "OBEC"),
                mapOf("id" to "591939", "name" to "Výčapy", "type" to "OBEC"),
                mapOf("id" to "591319", "name" to "Opatov", "type" to "OBEC"),
                mapOf("id" to "550001", "name" to "Vrcovice", "type" to "OBEC"),
                mapOf("id" to "554791", "name" to "Plzeň", "type" to "OBEC"),
                mapOf("id" to "545970", "name" to "Plzeň 1", "type" to "MC"),
                mapOf("id" to "545988", "name" to "Plzeň 2-Slovany", "type" to "MC"),
                mapOf("id" to "546003", "name" to "Plzeň 3", "type" to "MC"),
                mapOf("id" to "546208", "name" to "Plzeň 4", "type" to "MC"),
                mapOf("id" to "559199", "name" to "Plzeň 9-Malesice", "type" to "MC"),
                mapOf("id" to "554731", "name" to "Plzeň 5-Křimice", "type" to "MC"),
                mapOf("id" to "554758", "name" to "Plzeň 6-Litice", "type" to "MC"),
                mapOf("id" to "554766", "name" to "Plzeň 7-Radčice", "type" to "MC")
            ),
            database.getLocations()
        )
    }
}