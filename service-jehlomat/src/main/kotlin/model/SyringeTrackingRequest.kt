package model

import kotlinx.serialization.Serializable

@Serializable
data class SyringeTrackingRequest (
    val email: String
)