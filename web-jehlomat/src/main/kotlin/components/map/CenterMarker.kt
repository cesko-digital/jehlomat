package components.map

import kotlinx.css.*
import react.*
import styled.css
import styled.styledImg

fun RBuilder.centerMarker(
    width: Int,
    height: Int
): ReactElement = child(
    component = centerMarker,
    props = CenterMarkerProps(width, height)
)

private val centerMarker = functionalComponent<CenterMarkerProps> { props ->
    styledImg(src = "/images/map-marker.svg") {
        css {
            width = (props.width).px
            height = (props.height).px

            position = Position.absolute
            left = 50.pct - (props.width / 2).px
            top = 50.pct - (props.height).px
        }
    }
}

private data class CenterMarkerProps(
    val width: Int,
    val height: Int
) : RProps
