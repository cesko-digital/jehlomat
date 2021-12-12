package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import services.DatabaseService
import utils.isValidCoordinates


fun Route.locationApi(database: DatabaseService): Route {
    return get {
        val gps = call.parameters["gps"]

        if (gps == null || !gps.isValidCoordinates()) {
            call.respond(HttpStatusCode.BadRequest, "Bad format")
        } else {
            call.respond(HttpStatusCode.OK, database.getLocationCombinations(gps))
        }

    }
}
