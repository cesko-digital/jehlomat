package store.reducers

import kotlinx.serialization.Serializable
import redux.RAction

enum class Pages {
    MainPage,
    NewFinding
}

@Serializable
data class MainState(
    val page: Pages = Pages.MainPage
)

fun appMainReducer(state: MainState, action: RAction): MainState {
    return when (action) {
        is GoToPage -> state.copy(
            page = action.page
        )
        else -> state
    }
}

data class GoToPage(
    val page: Pages
): RAction