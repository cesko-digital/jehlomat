package api

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import services.DatabaseService


fun Route.locationApi(database: DatabaseService): Route {
    return get {
        val gps = call.parameters["gpsCoordinates"]

        if (gps == null) {
            call.respond(HttpStatusCode.BadRequest, "Bad format")
        } else {
            call.respond(HttpStatusCode.OK, database.getLocationCombinations(gps))
        }

    }
}
