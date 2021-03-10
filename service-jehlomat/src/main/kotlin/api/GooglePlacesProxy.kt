package api

import com.github.kittinunf.fuel.Fuel
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.util.*

fun Route.googlePlacesProxy(): Route {
    return route("/proxy") {
        get("/autocomplete") {
            val parameters = call.request.queryParameters.flattenEntries()

            val (_, response, result) = Fuel.get(
                path = "https://maps.googleapis.com/maps/api/place/autocomplete/json",
                parameters = parameters
            ).responseString()

            call.respondText(
                contentType = ContentType.Application.Json,
                status = HttpStatusCode(response.statusCode, "")
            ) { result.get() }
        }

        get("/details") {
            val parameters = call.request.queryParameters.flattenEntries()

            val (_, response, result) = Fuel.get(
                path = "https://maps.googleapis.com/maps/api/place/details/json",
                parameters = parameters
            ).responseString()

            call.respondText(
                contentType = ContentType.Application.Json,
                status = HttpStatusCode(response.statusCode, "")
            ) { result.get() }
        }
    }
}