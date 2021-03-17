package components

import kotlinx.css.*
import react.*
import styled.css
import styled.styledDiv
import styled.styledImg
import styles.Colors

fun RBuilder.logoMobile(

): ReactElement = child(
    component = logoMobile
)

private val logoMobile = functionalComponent<RProps> {
    styledDiv {
        css {
            height = 58.px
            width = 48.px
            backgroundColor = Colors.primary

            display = Display.flex
            justifyContent = JustifyContent.center
            alignItems = Align.center

            borderTopRightRadius = 29.px
            borderBottomRightRadius = 29.px

            position = Position.absolute
            zIndex = 100
            top = 43.px
            left = 0.px
        }
        styledImg(src = "/images/jehlomat-icon.svg") {

        }
    }
}
