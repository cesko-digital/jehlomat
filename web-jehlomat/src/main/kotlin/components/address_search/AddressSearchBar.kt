package components.address_search

import koin
import kotlinx.css.*
import kotlinx.html.js.onBlurFunction
import org.w3c.dom.HTMLInputElement
import org.w3c.dom.events.Event
import react.*
import services.places.AutocompleteResponse
import services.places.IPlaces
import services.user.getUserHistoryData
import store.appStore
import store.dispatch2
import store.reducers.UpdateLocation
import styled.css
import styled.styledDiv
import utils.Either

fun RBuilder.addressSearchBar(

): ReactElement = child(
    component = addressSearchBar
)

private val addressSearchBar = functionalComponent<RProps> {
    val (autocompleteResults, setAutocompleteResults) = useState(
        AutocompleteResultState(
            autocompleteResults = getUserHistoryData(),
            isHistory = true
        )
    )
    val (isLoading, setIsLoading) = useState(false)
    val (showResults, setShowResults) = useState(false)

    val onSelectedAddress: (AutocompleteResponse) -> Unit = {
        setIsLoading(true)
        koin<IPlaces>().geolocation(
            placeId = it.placeId
        ) { result ->
            when (result) {
                is Either.Success -> {
                    appStore.dispatch2(
                        UpdateLocation(
                            latitude = result.value.latitude,
                            longitude = result.value.longitude
                        )
                    )
                    setShowResults(false)
                }
                is Either.Error -> {
                    console.error(result.exception)
                }
            }
            setIsLoading(false)
        }
    }

    val inputOnChange: (Event) -> Unit = { event ->
        val searchTerm = (event.target as HTMLInputElement).value

        if (searchTerm.isEmpty()) {
            setAutocompleteResults(
                AutocompleteResultState(
                    autocompleteResults = getUserHistoryData(),
                    isHistory = true
                )
            )
        } else {
            setIsLoading(true)
            koin<IPlaces>().autocomplete(
                search = searchTerm
            ) { places ->
                when (places) {
                    is Either.Error -> {
                        console.error(places.exception)
                    }
                    is Either.Success -> {
                        setAutocompleteResults(
                            AutocompleteResultState(
                                autocompleteResults = places.value,
                                isHistory = false
                            )
                        )
                    }
                }
                setIsLoading(false)
            }
        }
    }

    styledDiv {
        attrs {
            onBlurFunction = {
                /* TODO:
                    Tady potrebujeme overit, jestli klikame na results a v tom pripade
                    je neschovavat.
                 */

                // setShowResults(false)
            }
        }
        css {
            width = 80.pct

            position = Position.absolute
            top = 20.px
            right = 0.px

            zIndex = 100
        }
        searchBar(
            height = 44,
            onChangeFunction = inputOnChange,
            onFocusFunction = {
                setShowResults(true)
            }
        )
        if (showResults) {
            addressSearchResult(
                results = autocompleteResults.autocompleteResults,
                showAsHistory = autocompleteResults.isHistory,
                isLoading = isLoading,
                selectedAddress = onSelectedAddress
            )
        }
    }
}

private data class AutocompleteResultState(
    val autocompleteResults: List<AutocompleteResponse>,
    val isHistory: Boolean
)
