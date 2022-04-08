package model.location

import kotlinx.serialization.Serializable

@Serializable
data class LocationId(
    val id: String,
    val type: LocationType
)
