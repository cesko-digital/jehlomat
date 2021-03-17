package components

import components.address_search.addressSearchBar
import components.map.maps
import kotlinx.css.*
import kotlinx.css.properties.transform
import kotlinx.css.properties.translateX
import react.*
import store.HistoryType
import store.appStore
import store.reducers.GoToNewFindingPage
import store.reducers.NewFindingAction
import store.reducers.NewFindingPage
import store.reducers.NewFindingState
import store.useRedux
import styled.css
import styled.styledDiv

fun RBuilder.newFindingPage(

): ReactElement = child(
    component = newFindingPage
)

private val newFindingPage = functionalComponent<RProps> {
    val (newFindingState, dispatchNewFindingAction) = useRedux<NewFindingState, NewFindingAction> {
        appStore.getState().newFindingState
    }

    when (newFindingState.page) {
        NewFindingPage.Location -> {
            addressSearchBar()
            logoMobile()

            maps()

            styledDiv {
                css {
                    position = Position.fixed
                    zIndex = 100

                    bottom = 38.px
                    left = 50.pct
                    transform {
                        translateX((-50).pct)
                    }

                    display = Display.flex
                    justifyContent = JustifyContent.center
                }
                mainButton(
                    title = "Uložit polohu",
                    onCLick = {
                        dispatchNewFindingAction(
                            GoToNewFindingPage(
                                page = NewFindingPage.AditionalInformation
                            ),
                            HistoryType.PushWithReplace
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
