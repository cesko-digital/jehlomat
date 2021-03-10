package components

import kotlinx.css.*
import kotlinx.html.js.onClickFunction
import react.*
import store.HistoryType
import store.reducers.GoToPage
import store.reducers.Pages
import store.useReduxNoState
import styled.css
import styled.styledButton
import styled.styledDiv

fun RBuilder.mainPage(

): ReactElement = child(
    component = mainPage
)

private val mainPage = functionalComponent<RProps> {
    val dispatchNavigationAction = useReduxNoState<GoToPage>()

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
                    dispatchNavigationAction(
                        GoToPage(
                            page = Pages.NewFinding
                        ),
                        HistoryType.Push
                    )
                }
            }
            +"Novy nalez"
        }
    }
}