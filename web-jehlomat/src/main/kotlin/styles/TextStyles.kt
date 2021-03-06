package styles

import kotlinx.css.*
import styled.StyleSheet

object TextStyles : StyleSheet("text", true) {
    val h1 by css {
        fontSize = 35.px
        fontWeight = FontWeight.w700
    }

    val h2 by css {
        fontSize = 21.px
        fontWeight = FontWeight.w700
    }

    val formLabel by css {
        fontSize = 17.px
        fontWeight = FontWeight.w700
    }
}