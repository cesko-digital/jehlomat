package services

import model.*
import org.junit.After
import org.junit.Before
import org.junit.Test
import service.DatabaseService
import service.DatabaseServiceImpl
import kotlin.test.assertEquals

class DatabaseServiceImplTest {

    var database: DatabaseService = DatabaseServiceImpl()

    @Before
    fun beforeEach() {
        database.cleanLocation()
        database.cleanTeams()
    }

    @After
    fun afterEach() {
        database.cleanLocation()
        database.cleanTeams()
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
    fun testResolveNearestTeam() {
        val exactTeamLocation = Location(0, "Plzeň-město", "Plzeň", "Plzeň 3")
        val users = listOf<UserInfo>()
        val exactTeam = Team("teamA", exactTeamLocation, users, "orgName")

        val obecTeamLocation = Location(0, "Plzeň-město", "Plzeň", "Plzeň 9-Malesice")
        val obecTeam = Team("teamA", obecTeamLocation, users, "orgName")

        database.insertTeam(exactTeam)
        database.insertTeam(obecTeam)

        val actualTeam = database.resolveNearestTeam("13.3719999 49.7278823")
        // update ID because of DB auto incementation
        val expectedTeam = exactTeam.copy(location=exactTeamLocation.copy(id=actualTeam.location.id))

        assertEquals(expectedTeam, actualTeam)
    }
}