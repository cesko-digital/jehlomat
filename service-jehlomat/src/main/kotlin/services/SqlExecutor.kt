package services

class SqlExecutor (val database: DatabaseService){

    fun runScript(file: String) {
        val content = SqlExecutor::class.java.getResource(file)?.readText()!!

        database.useConnection { conn ->
            content.split(";").forEach {statement ->
                val stmt = conn.createStatement()
                stmt.execute(statement)
            }
        }
    }
}