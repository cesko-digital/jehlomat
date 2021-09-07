package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.*

val teams = mutableListOf<Team>()


// TODO: all operations need to be atomic
fun Route.teamApi(): Route {

    return route("/") {
        get("/{team}") {
            // TODO: check if adminitrator is logged user
            val team = call.parameters["team"]
            try {
                val filteredOrganization = teams.filter { it.name == team }[0]
                call.respond(HttpStatusCode.OK, filteredOrganization)
            } catch (ex: IndexOutOfBoundsException) {
                call.respond(HttpStatusCode.NotFound)
            }
        }

        post {
            val team = call.receive<Team>()
            // TODO: check if adminitrator is logged user
            when {
                teams.any { it.name == team.name } -> {
                    call.respond(HttpStatusCode.Conflict)
                }
                else -> {
                    teams.add(team)
                    call.respond(HttpStatusCode.Created)
                }
            }
        }

        put {
            // TODO: check if adminitrator is logged user
            val newTeam = call.receive<Team>()
            val currentTeams = teams.filter { it.name == newTeam.name }

            if (currentTeams.isEmpty()) {
                call.respond(HttpStatusCode.NotFound)
            } else {
                val currentTeam = currentTeams[0]
                // TODO: check if administrator exists
                teams.removeIf { it.name == currentTeam.name }
                teams.add(newTeam)
                call.respond(HttpStatusCode.OK)
            }
        }
    }
}