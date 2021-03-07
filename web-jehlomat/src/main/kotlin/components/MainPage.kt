package components

import kotlinx.css.*
import kotlinx.html.js.onClickFunction
import react.*
import store.appStore
import store.dispatchNavigation
import store.reducers.GoToPage
import store.reducers.Pages
import styled.css
import styled.styledButton
import styled.styledDiv

fun RBuilder.mainPage(

): ReactElement = child(
    component = mainPage
)

private val mainPage = functionalComponent<RProps> {

    styledDiv {
        css {
            display = Display.flex
            flexDirection = FlexDirection.column
            justifyContent = JustifyContent.center
            alignItems = Align.center
        }

        styledButton {
            attrs {
                onClickFunction = {
                    appStore.dispatchNavigation(
                        action = GoToPage(
                            page = Pages.NewFinding
                        ),
                        title = "Jehlomat - Nový nález",
                        url = "#/novynalez"
                    )
                }
            }
            +"Novy nalez"
        }
    }
}