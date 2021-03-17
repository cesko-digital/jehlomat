package app

import components.mainPage
import components.newFindingPage
import kotlinx.browser.window
import react.*
import store.HistoryType
import store.appStore
import store.reducers.GoToPage
import store.reducers.Pages
import store.useReduxUntyped


fun RBuilder.app() = child(
    component = app
)

private val app = functionalComponent<RProps> {
    val (page, dispatchPageAction) = useReduxUntyped {
        appStore.getState().appMainState.page
    }

    /*
        Runs once when main component load, it's used for processing hash navigation
     */
    useEffect(
        dependencies = listOf()
    ) {
        when (window.location.hash) {
            else -> {
                dispatchPageAction(
                    GoToPage(
                        page = Pages.MainPage
                    ),
                    HistoryType.Push
                )
            }
        }
    }

    when (page) {
        Pages.MainPage -> mainPage()
        Pages.NewFinding -> newFindingPage()
    }
}