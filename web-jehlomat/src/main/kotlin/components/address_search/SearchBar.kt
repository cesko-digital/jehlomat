package components.address_search

import kotlinx.css.*
import kotlinx.html.InputType
import kotlinx.html.js.onChangeFunction
import kotlinx.html.js.onFocusFunction
import org.w3c.dom.events.Event
import react.*
import styled.css
import styled.styledDiv
import styled.styledImg
import styled.styledInput
import styles.Colors

fun RBuilder.searchBar(
    height: Int,
    onChangeFunction: (Event) -> Unit,
    onFocusFunction: (Event) -> Unit
): ReactElement = child(
    component = searchBar,
    props = SearchBarProps(height, onChangeFunction, onFocusFunction)
)

private val searchBar = functionalComponent<SearchBarProps> { props ->
    styledDiv {
        css {
            height = (props.height).px

            display = Display.flex
            flexDirection = FlexDirection.row
            justifyContent = JustifyContent.start
            alignItems = Align.center

            padding(horizontal = (props.height / 4).px)

            backgroundColor = Colors.primary

            borderBottomLeftRadius = (props.height / 2).px
            borderTopLeftRadius = (props.height / 2).px
        }
        styledImg(src = "/images/search-icon.svg") {
            css {
                width = (props.height / 2).px
                height = (props.height / 2).px

                margin(right = (props.height / 4).px)
            }
        }
        styledInput(type = InputType.text) {
            css {
                color = Color.white
                backgroundColor = Color.transparent
                borderWidth = 0.px

                outline = Outline.none

                width = 100.pct
                flexGrow = 1.0

                fontSize = 16.px

                placeholder {
                    color = Color.white
                    opacity = 0.5
                }
            }
            attrs {
                placeholder = "Vyhledejte konkrétní adresu"
                onChangeFunction = props.onChangeFunction
                onFocusFunction = props.onFocusFunction
            }
        }
    }
}

private data class SearchBarProps(
    val height: Int,
    val onChangeFunction: (Event) -> Unit,
    val onFocusFunction: (Event) -> Unit
) : RProps

