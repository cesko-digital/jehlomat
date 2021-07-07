package api

import com.github.kittinunf.fuel.Fuel
import com.google.maps.GeoApiContext
import com.google.maps.GeocodingApi
import com.google.maps.model.AddressComponentType
import com.google.maps.model.GeocodingResult
import com.google.maps.model.LatLng
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.util.*


fun getLocation(gps: String): GeocodingResult {
    val (latitude, longitude) = gps.split(",").map { it.toDouble() }

    val context = GeoApiContext.Builder().apiKey("123").build()
    val results: Array<GeocodingResult> = GeocodingApi.reverseGeocode(
        context,
        LatLng(latitude, longitude)
    ).await()

    return results[0]
}


fun getCity(geocodingResult: GeocodingResult): String {
    return geocodingResult.addressComponents
        .filter { AddressComponentType.LOCALITY in it.types }[0].longName
}


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