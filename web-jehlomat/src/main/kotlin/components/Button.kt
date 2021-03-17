package components

import kotlinx.css.*
import kotlinx.css.properties.border
import kotlinx.css.properties.boxShadow
import kotlinx.html.js.onClickFunction
import org.w3c.dom.events.Event
import react.*
import styled.css
import styled.styledButton
import styles.Colors
import styles.TextStyles

fun RBuilder.mainButton(
    onCLick: (Event) -> Unit,
    title: String
): ReactElement = child(
    component = button,
    props = ButtonProps(
        height = 56,
        onCLick = onCLick,
        title = title
    )
)

private val button = functionalComponent<ButtonProps> { props ->

    styledButton {
        attrs {
            onClickFunction = props.onCLick
        }
        css {
            +TextStyles.button

            height = (props.height).px

            backgroundColor = Colors.secondary
            color = Color.white

            display = Display.flex
            justifyContent = JustifyContent.center
            alignItems = Align.center

            padding(horizontal = 38.px)

            border(
                style = BorderStyle.solid,
                width = 1.px,
                color = Colors.borderRed,
                borderRadius = (props.height / 2).px
            )

            boxShadow(
                color = Colors.shadowRed,
                offsetX = 0.px,
                offsetY = 3.px,
                blurRadius = 3.px,
                spreadRadius = 0.px
            )

            hover {
                cursor = Cursor.pointer
            }
        }
        +props.title
    }
}

private data class ButtonProps(
    val height: Int,
    val onCLick: (Event) -> Unit,
    val title: String
): RProps