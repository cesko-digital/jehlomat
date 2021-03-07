package store

import kotlinx.browser.window
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString
import redux.*
import store.reducers.MainState
import store.reducers.NewFindingState
import store.reducers.appMainReducer
import store.reducers.newFindingReducer

val reducer: Reducer<State, RAction> = { state, action ->
    console.info(
        Json.encodeToString(state)
    )
    if (action is RollbackState) {
        action.state
    } else {
        State(
            appMainState = appMainReducer(state.appMainState, action),
            newFindingState = newFindingReducer(state.newFindingState, action)
        )
    }
}

val appStore = createStore<State, RAction, dynamic>(
    reducer, State(), rEnhancer()
)

@Serializable
data class State(
    val appMainState: MainState = MainState(),
    val newFindingState: NewFindingState = NewFindingState()
)

fun Store<State, RAction, dynamic>.dispatch2(action: RAction) {
    dispatch(action)
}

fun Store<State, RAction, dynamic>.dispatchNavigation(
    action: RAction,
    title: String = "Jehlomat",
    url: String
) {
    dispatch(action)

    val serializedState = Json.encodeToString(state)
    window.history.pushState(serializedState, title, url)
}

data class RollbackState(
    val state: State
): RAction