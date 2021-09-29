package model

import kotlinx.serialization.Serializable

@Serializable
data class Syringe(
    val id: Long,
    val timestamp: Long,
    val email: String,
    val photo: String,
    val count: Int,
    val note: String,
    val demolisher: Demolisher,
    val gps_coordinates: String,
    val demolished: Boolean
)
