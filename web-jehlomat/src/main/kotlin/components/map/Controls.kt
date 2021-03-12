package components.map

import kotlinx.css.*
import kotlinx.css.properties.border
import kotlinx.html.js.onClickFunction
import org.w3c.dom.events.Event
import react.*
import styled.StyleSheet
import styled.css
import styled.styledDiv
import styles.Colors

fun RBuilder.mapZoomControl(
    onPlus: (Event) -> Unit,
    onMinus: (Event) -> Unit
): ReactElement = child(
    component = mapZoomControl,
    props = MapZoomControlProps(onPlus, onMinus)
)

fun RBuilder.mapTypeControl(
    title: String,
    onSwitch: (Event) -> Unit
): ReactElement = child(
    component = mapTypeControl,
    props = MapTypeControlProps(title, onSwitch)
)

private object ControlsStyles : StyleSheet("controls") {
    val button by css {
        width = 44.px
        height = 44.px

        backgroundColor = Color.white

        display = Display.flex
        alignItems = Align.center
        justifyContent = JustifyContent.center

        fontSize = 18.px
        fontWeight = FontWeight.w700

        color = Colors.primary
        userSelect = UserSelect.none

        border(
            width = 1.px,
            style = BorderStyle.solid,
            color = Color.lightGray,
            borderRadius = 3.px
        )

        hover {
            cursor = Cursor.pointer
        }
    }
}

private val mapZoomControl = functionalComponent<MapZoomControlProps> { props ->
    styledDiv {
        css {
            display = Display.flex
            flexDirection = FlexDirection.column
        }
        styledDiv {
            attrs {
                onClickFunction = props.onPlus
            }
            css {
                +ControlsStyles.button
            }
            +"+"
        }
        styledDiv {
            attrs {
                onClickFunction = props.onMinus
            }
            css {
                +ControlsStyles.button
            }
            +"-"
        }
    }
}

private data class MapZoomControlProps(
    val onPlus: (Event) -> Unit,
    val onMinus: (Event) -> Unit
) : RProps

private val mapTypeControl = functionalComponent<MapTypeControlProps> { props ->
    styledDiv {
        attrs {
            onClickFunction = props.onSwitch
        }
        css {
            +ControlsStyles.button
        }
        +props.title
    }
}

private data class MapTypeControlProps(
    val title: String,
    val onSwitch: (Event) -> Unit
) : RProps
