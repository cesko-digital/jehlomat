package components

import components.address_search.addressSearchBar
import kotlinx.css.*
import react.*
import store.appStore
import store.dispatchNavigationWithReplace
import store.reducers.GoToNewFindingPage
import store.reducers.NewFindingPage
import styled.css
import styled.styledDiv

fun RBuilder.newFindingPage(

): ReactElement = child(
    component = newFindingPage
)

private val newFindingPage = functionalComponent<RProps> {
    val (newFindingState, setNewFindingState) = useState(appStore.getState().newFindingState)

    useEffectWithCleanup {
        appStore.subscribe {
            if (newFindingState.page != appStore.getState().newFindingState.page) {
                setNewFindingState(appStore.getState().newFindingState)
            }
        }
    }

    when (newFindingState.page) {
        NewFindingPage.Location -> {
            addressSearchBar()

            maps()

            styledDiv {
                css {
                    position = Position.fixed
                    zIndex = 100

                    bottom = 38.px
                    left = 0.px
                    right = 0.px

                    display = Display.flex
                    justifyContent = JustifyContent.center
                }
                mainButton(
                    title = "Uložit polohu",
                    onCLick = {
                        appStore.dispatchNavigationWithReplace(
                            action = GoToNewFindingPage(
                                page = NewFindingPage.AditionalInformation
                            ),
                            title = "Jehlomat - Nový nález",
                            url = "#/novynalez"
                        )
                    }
                )
            }
        }
        NewFindingPage.AditionalInformation -> {
            newFindingInfoPage()
        }
    }
}