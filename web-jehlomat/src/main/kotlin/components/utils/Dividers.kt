package components.utils

import kotlinx.css.*
import react.*
import styled.css
import styled.styledDiv

fun RBuilder.horizontalDivider(
    size: Int
): ReactElement = child(
    component = divider,
    props = DividerProps(
        horizontal = size.px,
        vertical = 0.px
    )
)

fun RBuilder.verticalDivider(
    size: Int
): ReactElement = child(
    component = divider,
    props = DividerProps(
        horizontal = 0.px,
        vertical = size.px
    )
)

private val divider = functionalComponent<DividerProps> { props ->
    styledDiv {
        css {
            width = props.horizontal
            minWidth = props.horizontal
            height = props.vertical
            minHeight = props.vertical
        }
    }
}

private data class DividerProps(
    val horizontal: LinearDimension,
    val vertical: LinearDimension
) : RProps
