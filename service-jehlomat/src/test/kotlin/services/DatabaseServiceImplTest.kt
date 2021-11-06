package services

import model.Location
import model.Team
import model.User
import model.UserInfo
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.mindrot.jbcrypt.BCrypt
import service.DatabaseService
import service.DatabaseServiceImpl
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class DatabaseServiceImplTest {

    var database: DatabaseService = DatabaseServiceImpl()

    @Before
    fun beforeEach() {
        database.cleanLocation()
        database.cleanTeams()
        database.cleanUsers()
    }

    @After
    fun afterEach() {
        database.cleanLocation()
        database.cleanTeams()
        database.cleanUsers()
    }

    @Test
    fun testGetObec() {
        val actualObec = database.getObec("17.2825351 49.6602072")
        assertEquals("Bohuňovice", actualObec)
    }

    @Test
    fun testGetMC() {
        val actualObec = database.getMC("13.3719999 49.7278823")
        assertEquals("Plzeň 3", actualObec)
    }

    @Test
    fun testGetOkres() {
        val actualObec = database.getOkres("13.3719999 49.7278823")
        assertEquals("Plzeň-město", actualObec)
    }

    @Test
    fun testGetNone() {
        val actualObec = database.getObec("00.0000000 00.0000000")
        assertEquals("", actualObec)
    }

    @Test
    fun testSelectUserByEmail() {
        assertNull(database.selectUserByEmail("not-existent-user"))

        database.insertUser(User("email", "password", false, ""))

        val user = database.selectUserByEmail("email")
        assertNotNull(user)
        assertEquals("email", user.email)
        assertNotNull(user.password)
        assertEquals(false, user.verified)
    }

    @Test
    fun testHashingUserPassword() {
        val originalPassword = "original-password"
        database.insertUser(User("email", originalPassword, false, ""))

        val user = database.selectUserByEmail("email")
        assertNotNull(user)
        assertNotEquals(originalPassword, user.password)
        assert(BCrypt.checkpw(originalPassword, user.password))

        val newPassword = "new-password"
        database.updateUser(User("email", newPassword, false, ""))

        val updatedUser = database.selectUserByEmail("email")
        assertNotNull(updatedUser)
        assertNotEquals(originalPassword, updatedUser.password)
        assert(BCrypt.checkpw(newPassword, updatedUser.password))
    }

    @Test
    fun testResolveNearestTeam() {
        val exactTeamLocation = Location(0, "Plzeň-město", "Plzeň", "Plzeň 3")
        val exactTeam = Team("teamA", exactTeamLocation, "orgName")

        val obecTeamLocation = Location(0, "Plzeň-město", "Plzeň", "Plzeň 9-Malesice")
        val obecTeam = Team("teamA", obecTeamLocation, "orgName")

        database.insertTeam(exactTeam)
        database.insertTeam(obecTeam)

        val actualTeam = database.resolveNearestTeam("13.3719999 49.7278823")
        // update ID because of DB auto incementation
        val expectedTeam = exactTeam.copy(location=exactTeamLocation.copy(id=actualTeam.location.id))

        assertEquals(expectedTeam, actualTeam)
    }
}