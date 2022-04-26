package api

import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.*
import model.team.Team
import model.team.TeamRequest
import model.team.toRequest
import model.user.toUserInfo
import services.*


// TODO: all operations need to be atomic
fun Route.teamApi(databaseInstance: DatabaseService, jwtManager: JwtManager): Route {

    return route("") {
        authenticate(JWT_CONFIG_NAME) {
            get("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull()
                val team = id?.let { it1 -> databaseInstance.selectTeamById(it1) }

                if (team != null ) {
                    call.respond(HttpStatusCode.OK, team)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }

            get("/{id}/users") {
                val id = call.parameters["id"]?.toIntOrNull()

                val team = id?.let { it1 -> databaseInstance.selectTeamById(it1) }
                if (team == null) {
                    call.respond(HttpStatusCode.NotFound, "Team not found")
                    return@get
                }

                val loggedInUser = jwtManager.getLoggedInUser(call, databaseInstance)
                val roles = PermissionService.determineRoles(loggedInUser, team)
                if (loggedInUser.teamId != id && !roles.contains(Role.OrgAdmin)) {
                    call.respond(
                        HttpStatusCode.Forbidden,
                        "Only a member of the team or organization admin can view its members."
                    )
                    return@get
                }

                val users = databaseInstance.selectUsersByTeam(id)
                call.respond(HttpStatusCode.OK, users.map { user -> user.toUserInfo(roles.contains(Role.OrgAdmin)) })
            }

            post {
                val teamRequest = call.receive<TeamRequest>()
                when {
                    databaseInstance.selectTeamByName(teamRequest.name) != null -> {
                        call.respond(HttpStatusCode.Conflict)
                    }
                    else -> {
                        val loggedInUser = jwtManager.getLoggedInUser(call, databaseInstance)
                        val roles = PermissionService.determineRoles(loggedInUser, teamRequest)
                        if (!roles.contains(Role.OrgAdmin)) {
                            call.respond(HttpStatusCode.Forbidden,"A team can be created only by the organization administrator.")
                            return@post
                        }

                        val locations = databaseInstance.resolveLocationIds(teamRequest.locationIds)
                        val teamId = databaseInstance.insertTeam(Team(teamRequest.id, teamRequest.name, locations, teamRequest.organizationId))
                        call.respond(HttpStatusCode.Created, databaseInstance.selectTeamById(teamId)!!)
                    }
                }
            }

            put {
                val teamRequest = call.receive<TeamRequest>()
                val currentTeam = databaseInstance.selectTeamById(teamRequest.id)

                when {
                    currentTeam == null -> {
                        call.respond(HttpStatusCode.NotFound)
                    }
                    (teamRequest.name != currentTeam.name && databaseInstance.selectTeamByName(teamRequest.name) != null) -> {
                        call.respond(HttpStatusCode.Conflict)
                    }
                    else -> {
                        if (!RequestValidationWrapper.validatePutObject(call, jwtManager, databaseInstance, currentTeam.toRequest(), teamRequest)) {
                            return@put
                        }

                        val locations = databaseInstance.resolveLocationIds(teamRequest.locationIds)
                        databaseInstance.updateTeam(Team(teamRequest.id, teamRequest.name, locations, teamRequest.organizationId))
                        call.respond(HttpStatusCode.OK)
                    }
                }
            }
        }
    }
}