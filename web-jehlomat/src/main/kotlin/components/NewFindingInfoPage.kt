package components

import kotlinx.css.*
import kotlinx.html.js.onClickFunction
import react.*
import store.appStore
import store.dispatchNavigation
import store.reducers.CompleteNewFinding
import styled.css
import styled.styledButton
import styled.styledDiv

fun RBuilder.newFindingInfoPage(

): ReactElement = child(
    component = newFindingInfoPage
)

/* TODO:
    Placeholder page
 */
private val newFindingInfoPage = functionalComponent<RProps> {
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
                        action = CompleteNewFinding()
                    )
                }
            }
            +"Konec"
        }
    }
}