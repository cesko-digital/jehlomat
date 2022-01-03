package model.syringe

import kotlinx.serialization.Serializable

@Serializable
data class SyringeTrackingRequest (
    val email: String
)