package store.reducers

import kotlinx.serialization.Serializable
import redux.RAction

enum class NewFindingPage {
    Location,
    AditionalInformation
}

@Serializable
data class NewFindingState(
    val page: NewFindingPage = NewFindingPage.Location,
    val location: Location = Location(0.0, 0.0)
)

@Serializable
data class Location(
    val latitude: Double,
    val longitude: Double
)

fun newFindingReducer(state: NewFindingState, action: RAction): NewFindingState {
    return when (action) {
        is UpdateLocation -> state.copy(
            location = Location(
                latitude = action.latitude,
                longitude = action.longitude
            )
        )
        is GoToNewFindingPage -> state.copy(
            page = action.page
        )
        is CompleteNewFinding -> NewFindingState()
        else -> state
    }
}

interface NewFindingAction : RAction

data class UpdateLocation(
    val latitude: Double,
    val longitude: Double
) : NewFindingAction

data class GoToNewFindingPage(
    val page: NewFindingPage
) : NewFindingAction

class CompleteNewFinding : NewFindingAction