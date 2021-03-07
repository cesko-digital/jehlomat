package app

import components.mainPage
import components.newFindingPage
import kotlinx.browser.window
import react.*
import store.appStore
import store.dispatchNavigation
import store.reducers.GoToPage
import store.reducers.Pages


fun RBuilder.app() = child(
    component = app
)

private val app = functionalComponent<RProps> {
    val (page, setPage) = useState(appStore.getState().appMainState.page)

    useEffectWithCleanup {
        appStore.subscribe {
            if (page != appStore.getState().appMainState.page) {
                setPage(appStore.getState().appMainState.page)
            }
        }
    }

    /*
        Runs once when main component load, it's used for processing hash navigation
     */
    useEffect(
        dependencies = listOf()
    ) {
        when (window.location.hash) {
            else -> {
                appStore.dispatchNavigation(
                    action = GoToPage(
                        page = Pages.MainPage
                    ),
                    url = "#/"
                )
            }
        }
    }

    when (page) {
        Pages.MainPage -> mainPage()
        Pages.NewFinding -> newFindingPage()
    }
}