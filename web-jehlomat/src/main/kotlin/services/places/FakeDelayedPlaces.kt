package services.places

import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import utils.Either

class FakeDelayedPlaces : IPlaces {

    override fun autocomplete(
        search: String,
        onComplete: (Either<List<AutocompleteResponse>>) -> Unit
    ) {
        GlobalScope.launch {
            delay(1000)
            onComplete(
                Either.Success(
                    listOf(
                        AutocompleteResponse("Soukenná, Jablonec nad Nisou, Česko", "1"),
                        AutocompleteResponse("Soukenná, Hranice, Česko", "1"),
                        AutocompleteResponse("Soukenná, Frýdlant, Česko", "1")
                    )
                )
            )
        }
    }

    override fun geolocation(placeId: String, onComplete: (Either<String>) -> Unit) {
        GlobalScope.launch {
            delay(500)
            onComplete(
                Either.Success("test")
            )
        }
    }
}