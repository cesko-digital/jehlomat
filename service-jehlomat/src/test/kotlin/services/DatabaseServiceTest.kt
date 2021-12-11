package services

import main.team
import model.*
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.mindrot.jbcrypt.BCrypt
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
        database.cleanTeams()
        database.cleanUsers()
        database.cleanOrganizations()
        database.cleanLocation()
        defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", true))
    }

    @After
    fun afterEach() {
        database.cleanSyringes()
        database.cleanTeams()
        database.cleanUsers()
        database.cleanOrganizations()
        database.cleanLocation()
    }

    @Test
    fun testGetObec() {
        val actualObec = database.getObec("17.2825351 49.6602072")
        assertEquals("500852", actualObec)
    }

    @Test
    fun testGetMC() {
        val actualObec = database.getMC("13.3719999 49.7278823")
        assertEquals("546003", actualObec)
    }

    @Test
    fun testGetOkres() {
        val actualObec = database.getOkres("13.3719999 49.7278823")
        assertEquals("CZ0323", actualObec)
    }

    @Test
    fun testGetNone() {
        val actualObec = database.getObec("00.0000000 00.0000000")
        assertEquals("", actualObec)
    }

    @Test
    fun testSelectUserByEmail() {
        assertNull(database.selectUserByEmail("not-existent-user"))

        database.insertUser(User(0, "email", "Franta Pepa 1", "password", false, defaultOrgId, null, false))

        val user = database.selectUserByEmail("email")
        assertNotNull(user)
        assertEquals("email", user.email)
        assertNotNull(user.password)
        assertEquals(false, user.verified)
    }

    @Test
    fun testHashingUserPassword() {
        val originalPassword = "original-password"
        database.insertUser(User(0, "email","Franta Pepa 1", originalPassword, false, defaultOrgId, null, false))

        val user = database.selectUserByEmail("email")
        assertNotNull(user)
        assertNotEquals(originalPassword, user.password)
        assert(BCrypt.checkpw(originalPassword, user.password))

        val newPassword = "new-password"
        database.updateUser(User(0, "email", "Franta Pepa 1", newPassword, false, defaultOrgId, null, false))

        val updatedUser = database.selectUserByEmail("email")
        assertNotNull(updatedUser)
        assertNotEquals(originalPassword, updatedUser.password)
        assert(BCrypt.checkpw(newPassword, updatedUser.password))
    }

    @Test
    fun testResolveNearestTeam() {
        val exactTeamLocation = Location(0, "Plzeň-město", "Plzeň", "Plzeň 3")
        val exactTeam = Team(0,"teamA", exactTeamLocation, defaultOrgId)

        val obecTeamLocation = Location(0, "Plzeň-město", "Plzeň", "Plzeň 9-Malesice")
        val obecTeam = Team(0, "teamB", obecTeamLocation, defaultOrgId)

        val exactTeamId = database.insertTeam(exactTeam)
        database.insertTeam(obecTeam)

        val actualTeam = database.resolveNearestTeam("13.3719999 49.7278823")
        // update ID because of DB auto incementation
        val expectedTeam = exactTeam.copy(location=exactTeamLocation.copy(id=actualTeam!!.location.id ), id = exactTeamId)

        assertEquals(expectedTeam, actualTeam)
    }

    @Test
    fun testInsertSyringe() {
        val teamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
        val selectTeamById = database.selectTeamById(teamId)
        val loc = selectTeamById?.location!!
        val user = User(0, "email", "password", "Franta Pepa 1", true, defaultOrgId, null, false)
        val userId = database.insertUser(user)
        val userInfo = user.copy(id = userId).toUserInfo()
        val syringeToCreate = Syringe("", 0, userInfo, null, null, null, null,Demolisher.USER,"", 1, "", "", loc, false)
        val syringeId = database.insertSyringe(syringeToCreate)

        assertNotNull(syringeId)
        val createdSyringe = database.selectSyringeById(syringeId)
        assertEquals(syringeToCreate.copy(id = syringeId), createdSyringe)
    }

    @Test
    fun testSelectAllLocations() {
        assertEquals(
            listOf(
                Location(id=0, okres="CZ0323", obec="554791", mestkaCast="546003"),
                Location(id=0, okres="CZ0323", obec="554791", mestkaCast=""),
                Location(id=0, okres="CZ0323", obec="", mestkaCast="")
            ),
            database.selectAllLocations("13.3719999 49.7278823")
        )
    }
}