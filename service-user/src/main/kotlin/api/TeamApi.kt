package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.*

val teams = mutableListOf<Team>()


fun Route.teamApi(): Route {

    return route("/") {
        get("/{team}") {
            // TODO: check if values satisfy condition
            // TODO: check if adminitrator is logged user

            val team = call.parameters["team"]
            try {
                val filteredOrganization = teams.filter { it.name == team }[0]
                call.respond(HttpStatusCode.OK, filteredOrganization)
            } catch (ex: IndexOutOfBoundsException) {
                call.respond(HttpStatusCode.NotFound)
            }
        }
    }
}