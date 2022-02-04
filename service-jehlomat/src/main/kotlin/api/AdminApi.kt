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

            sqlExecutor.runScript("/sql/postgis.sql")
            sqlExecutor.runScript("/sql/mc.sql")
            sqlExecutor.runScript("/sql/obec.sql")
            sqlExecutor.runScript("/sql/okres.sql")
            sqlExecutor.runScript("/sql/create_table.sql")
            sqlExecutor.runScript("/sql/insert_super_admin.sql")

            call.respond(HttpStatusCode.Created)
        }
    }
}
