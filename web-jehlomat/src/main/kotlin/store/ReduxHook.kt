package store

import react.useEffectWithCleanup
import react.useState
import redux.RAction

enum class HistoryType {
    None,
    Push,
    PushWithReplace
}

fun <StateType> useReduxUntyped(
    state: () -> StateType
): Pair<StateType, (action: RAction, historyType: HistoryType) -> Unit> {
    return useRedux(state)
}

fun <StateType, ActionType : RAction> useRedux(
    state: () -> StateType
): Pair<StateType, (action: ActionType, historyType: HistoryType) -> Unit> {
    val (reduxState, setReduxSate) = useState(state())

    useEffectWithCleanup {
        appStore.subscribe {
            if (reduxState != state()) {
                setReduxSate(state())
            }
        }
    }

    return reduxState to ::dispatch
}

fun <ActionType : RAction> useReduxNoState(): (action: ActionType, historyType: HistoryType) -> Unit {
    return ::dispatch
}

private fun dispatch(action: RAction, historyType: HistoryType) {
    when (historyType) {
        HistoryType.None -> appStore.dispatch2(action)
        HistoryType.Push -> appStore.dispatchNavigation(action)
        HistoryType.PushWithReplace -> appStore.dispatchNavigationWithReplace(action)
    }
}