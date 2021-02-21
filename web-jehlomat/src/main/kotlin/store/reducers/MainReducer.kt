package store.reducers

import kotlinx.serialization.Serializable
import redux.RAction

@Serializable
data class MainState(
    val something: Int = 0
)

fun appMainReducer(state: MainState, action: RAction): MainState {
    return when (action) {
        is DummyAction -> state
        else -> state
    }
}

class DummyAction: RAction