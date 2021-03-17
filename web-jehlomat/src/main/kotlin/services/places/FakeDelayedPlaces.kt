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
                        AutocompleteResponse("Soukenná, Jablonec nad Nisou, Česko", "EiVTb3VrZW5uw6EsIEphYmxvbmVjIG5hZCBOaXNvdSwgxIxlc2tvIi4qLAoUChIJ3TfqI87KDkcRdsvfnh1cfWESFAoSCVXCndUsNQlHEXAiFWYPrwAE"),
                        AutocompleteResponse("Soukenná, Hranice, Česko", "EhpTb3VrZW5uw6EsIEhyYW5pY2UsIMSMZXNrbyIuKiwKFAoSCfFggkKU4aBHEbJDg5flS6ZREhQKEgnJ5XsKo-GgRxEh2usBdVa2xw"),
                        AutocompleteResponse("Soukenná, Frýdlant, Česko", "EhxTb3VrZW5uw6EsIEZyw71kbGFudCwgxIxlc2tvIi4qLAoUChIJyXqCsw8vCUcRc_rY1BXnDsoSFAoSCdeghlgFLwlHEdWlIzDM763Y")
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
                    "EiVTb3VrZW5uw6EsIEphYmxvbmVjIG5hZCBOaXNvdSwgxIxlc2tvIi4qLAoUChIJ3TfqI87KDkcRdsvfnh1cfWESFAoSCVXCndUsNQlHEXAiFWYPrwAE" -> Either.Success(GeolocationResponse(50.7227187, 15.1690199))
                    "EhpTb3VrZW5uw6EsIEhyYW5pY2UsIMSMZXNrbyIuKiwKFAoSCfFggkKU4aBHEbJDg5flS6ZREhQKEgnJ5XsKo-GgRxEh2usBdVa2xw" -> Either.Success(GeolocationResponse(50.3072491, 12.1743116))
                    "EhxTb3VrZW5uw6EsIEZyw71kbGFudCwgxIxlc2tvIi4qLAoUChIJyXqCsw8vCUcRc_rY1BXnDsoSFAoSCdeghlgFLwlHEdWlIzDM763Y" -> Either.Success(GeolocationResponse(50.925784, 15.0706858))
                    else -> Either.Error(exception = Exception())
                }
            )
        }
    }
}