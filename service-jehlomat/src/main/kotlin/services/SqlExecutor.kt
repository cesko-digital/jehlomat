package services

import java.io.File
import java.io.InputStream

class SqlExecutor (val database: DatabaseService){

    fun runScript(file: String) {
        val inputStream: InputStream = File(file).inputStream()
        val content = inputStream.bufferedReader().use { it.readText() }

        database.useConnection { conn ->
            content.split(";").forEach {statement ->
                val stmt = conn.createStatement()
                stmt.execute(statement)
            }
        }
    }
}