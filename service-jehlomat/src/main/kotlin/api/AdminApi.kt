package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import services.DatabaseService
import services.SqlExecutor

fun Route.adminApi(database: DatabaseService): Route {
    return route("") {
        post("/initdb") {
            val sqlExecutor = SqlExecutor(database)

            sqlExecutor.runScript("src/main/resources/sql/postgis.sql")
            sqlExecutor.runScript("src/main/resources/sql/mc.sql")
            sqlExecutor.runScript("src/main/resources/sql/obec.sql")
            sqlExecutor.runScript("src/main/resources/sql/okres.sql")
            sqlExecutor.runScript("src/main/resources/sql/create_table.sql")
            sqlExecutor.runScript("src/main/resources/sql/insert_super_admin.sql")

            call.respond(HttpStatusCode.Created)
        }
    }
}
