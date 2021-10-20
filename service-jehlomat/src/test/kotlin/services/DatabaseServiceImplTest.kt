package services

import org.junit.Test
import service.DatabaseService
import service.DatabaseServiceImpl
import kotlin.test.assertEquals

class DatabaseServiceImplTest {

    var database: DatabaseService = DatabaseServiceImpl()

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
}