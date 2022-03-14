package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import services.DatabaseService
import utils.isValidCoordinates


fun Route.locationApi(database: DatabaseService): Route {
    return route("/") {
        get("point") {
            val gps = call.parameters["gps"]

            if (gps == null || !gps.isValidCoordinates()) {
                call.respond(HttpStatusCode.BadRequest, "Bad format")
            } else {
                call.respond(HttpStatusCode.OK, database.getLocationCombinations(gps))
            }
        }

        get("geometry") {
            val type = call.parameters["type"]
            val id = call.parameters["id"]

            if (type == null || id == null) {
                call.respond(HttpStatusCode.BadRequest, "Parameters id and type are required.")
                return@get
            }

            val table = when (type) {
                "obec" -> ObecTable
                "okres" -> OkresTable
                "mc" -> MCTable
                else -> {
                    call.respond(HttpStatusCode.BadRequest, "Unknown type ${type}.")
                    return@get
                }
            }

            val geom: String?
            try {
                geom = database.getLocationGeom(id, table)
            } catch (ex: NumberFormatException) {
                call.respond(HttpStatusCode.BadRequest, "ID for type $type must be a number.")
                return@get
            }

            if (geom != null) {
                call.respond(HttpStatusCode.OK, geom)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }

        get("all") {
            call.respond(HttpStatusCode.OK, database.getLocations())
        }
    }
}
