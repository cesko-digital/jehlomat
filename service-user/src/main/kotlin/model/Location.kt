package model

import kotlinx.serialization.Serializable

@Serializable
data class Location(
    val okres: String,
    val mesto: String,
    val mestkaCast: String
)
