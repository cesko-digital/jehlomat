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
}