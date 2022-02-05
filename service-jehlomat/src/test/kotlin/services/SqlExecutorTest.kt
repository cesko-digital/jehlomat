package services

import org.junit.Assert
import org.junit.Test

class SqlExecutorTest {
    private val sqlExecutor = SqlExecutor(DatabaseService())

    @Test
    fun testFileOpening() {
        sqlExecutor.runScript("/sql/create_table.sql")
        Assert.assertTrue(true)
    }
}