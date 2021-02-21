package services

import kotlinx.browser.window
import org.w3c.fetch.Request
import org.w3c.fetch.RequestInit
import utils.Either
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json


interface IPlaces {
    fun autocomplete(
        search: String,
        onComplete: (Either<List<AutocompleteResponse>>) -> Unit
    )

    fun geolocation(
        placeId: String,
        onComplete: (Either<String>) -> Unit
    )
}

class GoogleMapsPlaces(
    val googleMapsKey: String
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
            "https://maps.googleapis.com/maps/api/place/autocomplete/json?$parameters",
            object : RequestInit {
                override var method: String? = "GET"
            })

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
        onComplete: (Either<String>) -> Unit
    ) {
        val parameters = buildParametersString(
            parameters = hashMapOf(
                "place_id" to "EiVTb3VrZW5uw6EsIEphYmxvbmVjIG5hZCBOaXNvdSwgxIxlc2tvIi4qLAoUChIJ3TfqI87KDkcRdsvfnh1cfWESFAoSCVXCndUsNQlHEXAiFWYPrwAE",
                "fields" to "name,geometry",
                "key" to googleMapsKey
            )
        )

        val request = Request(
            input = "https://maps.googleapis.com/maps/api/place/details/json?$parameters",
            init = object : RequestInit {
                override var method: String? = "GET"
            }
        )

        window.fetch(request)
            .then { response ->
                response.text().then {
                    onComplete(Either.Success(it))
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

data class AutocompleteResponse(
    val description: String,
    val placeId: String
)

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