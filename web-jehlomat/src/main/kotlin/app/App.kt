package app

import components.maps
import koin
import kotlinx.html.InputType
import kotlinx.html.js.onChangeFunction
import org.w3c.dom.HTMLInputElement
import react.RBuilder
import react.RProps
import react.child
import react.functionalComponent
import services.places.IPlaces
import styled.styledInput
import utils.Either


fun RBuilder.app() = child(
    component = app
)

private val app = functionalComponent<RProps> {
    styledInput(type = InputType.text) {
        attrs {
            onChangeFunction = { event ->
                koin<IPlaces>().autocomplete(
                    search = (event.target as HTMLInputElement).value
                ) { places ->
                    when (places) {
                        is Either.Error -> {
                            console.error(places.exception)
                        }
                        is Either.Success -> {
                            places.value.forEach {
                                console.info(it.description)
                            }
                        }
                    }
                }
            }
        }
    }

    maps()
}