package services

class SqlExecutor (val database: DatabaseService){

    fun runScript(file: String) {
        val content = SqlExecutor::class.java.getResource(file)?.readText()!!
        executeScript(content)
    }

    fun runScript(file: String, find: String, replace: String) {
        val content = SqlExecutor::class.java.getResource(file)?.readText()!!
        executeScript(content.replace(find, replace))
    }

    fun executeScript(script: String) {
        database.useConnection { conn ->
            script.split(";").forEach {statement ->
                val stmt = conn.createStatement()
                stmt.execute(statement)
            }
        }
    }
}