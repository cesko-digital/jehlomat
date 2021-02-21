package externals.googleMapReact

import react.RBuilder
import react.RElementBuilder
import react.ReactElement

fun RBuilder.googleMap(block: RElementBuilder<Props>.() -> Unit): ReactElement {
    return child(GoogleMapReact::class, block)
}