package services.places

import kotlinx.browser.window
import org.w3c.fetch.Request
import org.w3c.fetch.RequestInit
import utils.Either
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import services.buildParametersString

class GoogleMapsPlaces(
    val googleMapsKey: String,
    val baseUrl: String
) : IPlaces {

    override fun autocomplete(
        search: String,
        onComplete: (Either<List<AutocompleteResponse>>) -> Unit
    ) {
        val parameters = buildParametersString(
            parameters = hashMapOf(
                "input" to search,
                "components" to "country:cz",
                "language" to "cs",
                "types" to "address",
                "key" to googleMapsKey
            )
        )

        val request = Request(
            input = "${baseUrl}/proxy/autocomplete?$parameters",
            init = RequestInit(
                method = "GET"
            )
        )

        window.fetch(request)
            .then { response ->
                response.text().then {
                    val result: GoogleMapsAutocompleteResponse = Json {
                        ignoreUnknownKeys = true
                    }.decodeFromString(it)
                    onComplete(
                        Either.Success(
                            result.predictions.map { prediction ->
                                AutocompleteResponse(
                                    description = prediction.description,
                                    placeId = prediction.placeId
                                )
                            })
                    )
                }
            }
            .catch {
                console.error("Network Error")
                onComplete(
                    Either.Error(
                        exception = Exception()
                    )
                )
            }
    }

    override fun geolocation(
        placeId: String,
        onComplete: (Either<GeolocationResponse>) -> Unit
    ) {
        val parameters = buildParametersString(
            parameters = hashMapOf(
                "place_id" to placeId,
                "fields" to "name,geometry",
                "key" to googleMapsKey
            )
        )

        val request = Request(
            input = "${baseUrl}/proxy/details?$parameters",
            init = RequestInit(
                method = "GET"
            )
        )

        window.fetch(request)
            .then { response ->
                response.text().then {
                    val result: GoogleMapsGeolocationResponse = Json {
                        ignoreUnknownKeys = true
                    }.decodeFromString(it)

                    onComplete(
                        Either.Success(
                            GeolocationResponse(
                                latitude = result.result.geometry.location.lat,
                                longitude = result.result.geometry.location.lng
                            )
                        )
                    )
                }
            }
            .catch {
                console.error("Network error")
                onComplete(
                    Either.Error(
                        exception = Exception()
                    )
                )
            }
    }
}

@Serializable
data class GoogleMapsAutocompleteResponse(
    val predictions: List<Prediction>,
    val status: String
) {
    @Serializable
    data class Prediction(
        val description: String,
        @SerialName("matched_substrings")
        val matchedSubstrings: List<MatchedSubstring>,
        @SerialName("place_id")
        val placeId: String,
        val reference: String,
        @SerialName("structured_formatting")
        val structuredFormatting: StructuredFormatting,
        val terms: List<Term>,
        val types: List<String>
    ) {
        @Serializable
        data class MatchedSubstring(
            val length: Int,
            val offset: Int
        )

        @Serializable
        data class StructuredFormatting(
            @SerialName("main_text")
            val mainText: String,
            @SerialName("main_text_matched_substrings")
            val mainTextMatchedSubstrings: List<MainTextMatchedSubstring>? = null,
            @SerialName("secondary_text")
            val secondaryText: String,
            @SerialName("secondary_text_matched_substrings")
            val secondaryTextMatchedSubstrings: List<SecondaryTextMatchedSubstring>? = null
        ) {
            @Serializable
            data class MainTextMatchedSubstring(
                val length: Int,
                val offset: Int
            )

            @Serializable
            data class SecondaryTextMatchedSubstring(
                val length: Int,
                val offset: Int
            )
        }

        @Serializable
        data class Term(
            val offset: Int,
            val value: String
        )
    }
}

@Serializable
data class GoogleMapsGeolocationResponse(
    val result: Result,
    val status: String
) {
    @Serializable
    data class Result(
        val geometry: Geometry,
        val name: String
    ) {
        @Serializable
        data class Geometry(
            val location: Location,
            val viewport: Viewport
        ) {
            @Serializable
            data class Location(
                val lat: Double,
                val lng: Double
            )

            @Serializable
            data class Viewport(
                val northeast: Northeast,
                val southwest: Southwest
            ) {
                @Serializable
                data class Northeast(
                    val lat: Double,
                    val lng: Double
                )

                @Serializable
                data class Southwest(
                    val lat: Double,
                    val lng: Double
                )
            }
        }
    }
}