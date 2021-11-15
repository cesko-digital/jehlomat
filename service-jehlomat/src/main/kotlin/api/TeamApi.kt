package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.*
import services.DatabaseService


// TODO: all operations need to be atomic
fun Route.teamApi(databaseInstance: DatabaseService): Route {

    return route("/") {
        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            val team = id?.let { it1 -> databaseInstance.selectTeamById(it1) }

            if (team != null ) {
                call.respond(HttpStatusCode.OK, team)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }

        post {
            val team = call.receive<Team>()
            when {
                databaseInstance.selectTeamByName(team.name) != null -> {
                    call.respond(HttpStatusCode.Conflict)
                }
                else -> {
                    databaseInstance.insertTeam(team)
                    call.respond(HttpStatusCode.Created)
                }
            }
        }

        put {
            val newTeam = call.receive<Team>()
            val currentTeam = databaseInstance.selectTeamById(newTeam.id)

            when {
                currentTeam == null -> {
                    call.respond(HttpStatusCode.NotFound)
                }
                (newTeam.name != currentTeam.name && databaseInstance.selectTeamByName(newTeam.name) != null) -> {
                    call.respond(HttpStatusCode.Conflict)
                }
                else -> {
                    databaseInstance.updateTeam(newTeam)
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}