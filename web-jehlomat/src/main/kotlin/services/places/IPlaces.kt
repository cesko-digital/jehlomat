package services.places

import utils.Either

interface IPlaces {
    fun autocomplete(
        search: String,
        onComplete: (Either<List<AutocompleteResponse>>) -> Unit
    )

    fun geolocation(
        placeId: String,
        onComplete: (Either<GeolocationResponse>) -> Unit
    )
}

data class AutocompleteResponse(
    val description: String,
    val placeId: String
) {
    fun getStreet(): String {
        return description.split(",").firstOrNull() ?: description
    }

    fun getCity(): String {
        return description.split(",").getOrNull(1) ?: description
    }
}

data class GeolocationResponse(
    val latitude: Double,
    val longitude: Double
)