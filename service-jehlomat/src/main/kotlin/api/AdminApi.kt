package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.InitDbRequest
import org.mindrot.jbcrypt.BCrypt
import services.DatabaseService
import services.SqlExecutor

fun Route.adminApi(database: DatabaseService): Route {
    return route("") {
        post("/initdb") {
            val request = call.receive<InitDbRequest>()
            if (!BCrypt.checkpw(request.password, "$2a$10\$d396lW/hRGx5iBHKTrI3/.khrKTkkLW4fooehYqbQ.9bDJIaliO0C")) {
                call.respond(HttpStatusCode.Unauthorized)
                return@post
            }

            val sqlExecutor = SqlExecutor(database)

            sqlExecutor.runScript("/sql/postgis.sql")
            if (request.creatGeoTables) {
                sqlExecutor.runScript("/sql/mc.sql")
                sqlExecutor.runScript("/sql/obec.sql")
                sqlExecutor.runScript("/sql/okres.sql")
            }
            sqlExecutor.runScript("/sql/create_table.sql")
            sqlExecutor.runScript("/sql/insert_super_admin.sql", "super@admin.cz", request.superAdminEmail)

            call.respond(HttpStatusCode.Created)
        }
    }
}
