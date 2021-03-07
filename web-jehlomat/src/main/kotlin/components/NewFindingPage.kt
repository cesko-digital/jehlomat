package components

import components.address_search.addressSearchBar
import react.*

fun RBuilder.newFindingPage(

): ReactElement = child(
    component = newFindingPage
)

private val newFindingPage = functionalComponent<RProps> {
    addressSearchBar()

    maps()
}