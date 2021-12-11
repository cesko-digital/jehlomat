package api

import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.*
import services.*


// TODO: all operations need to be atomic
fun Route.teamApi(databaseInstance: DatabaseService, jwtManager: JwtManager): Route {

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

        authenticate(JWT_CONFIG_NAME) {
            post {
                val team = call.receive<Team>()
                when {
                    databaseInstance.selectTeamByName(team.name) != null -> {
                        call.respond(HttpStatusCode.Conflict)
                    }
                    else -> {
                        val loggedInUser = jwtManager.getLoggedInUser(call, databaseInstance)
                        val roles = PermissionService.determineRoles(loggedInUser, team)
                        if (!roles.contains(Role.OrgAdmin)) {
                            call.respond(HttpStatusCode.Forbidden,"A team can be created only by the organization administrator.")
                            return@post
                        }

                        databaseInstance.insertTeam(team)
                        call.respond(HttpStatusCode.Created)
                    }
                }
            }
        }

        authenticate(JWT_CONFIG_NAME) {
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
                        if (!RequestValidationWrapper.validatePutObject(call, jwtManager, databaseInstance, currentTeam, newTeam)) {
                            return@put
                        }

                        databaseInstance.updateTeam(newTeam)
                        call.respond(HttpStatusCode.OK)
                    }
                }
            }
        }
    }
}