package services.places

import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import utils.Either

class FakeDelayedPlaces(
    val delay: Long = 1000
) : IPlaces {

    override fun autocomplete(
        search: String,
        onComplete: (Either<List<AutocompleteResponse>>) -> Unit
    ) {
        GlobalScope.launch {
            delay(delay)
            onComplete(
                Either.Success(
                    listOf(
                        AutocompleteResponse("Soukenná, Jablonec nad Nisou, Česko", "1"),
                        AutocompleteResponse("Soukenná, Hranice, Česko", "2"),
                        AutocompleteResponse("Soukenná, Frýdlant, Česko", "3")
                    )
                )
            )
        }
    }

    override fun geolocation(placeId: String, onComplete: (Either<GeolocationResponse>) -> Unit) {
        GlobalScope.launch {
            delay(delay)
            onComplete(
                when (placeId) {
                    "1" -> Either.Success(GeolocationResponse(50.7227187, 15.1690199))
                    "2" -> Either.Success(GeolocationResponse(50.3072491, 12.1743116))
                    "3" -> Either.Success(GeolocationResponse(50.925784, 15.0706858))
                    else -> Either.Error(exception = Exception())
                }
            )
        }
    }
}