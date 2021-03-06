package app

import components.address_search.addressSearchBar
import components.maps
import react.RBuilder
import react.RProps
import react.child
import react.functionalComponent


fun RBuilder.app() = child(
    component = app
)

private val app = functionalComponent<RProps> {
    addressSearchBar()

    maps()
}