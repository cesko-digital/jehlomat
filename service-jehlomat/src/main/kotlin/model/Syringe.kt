package model

import kotlinx.serialization.Serializable

@Serializable
data class Syringe(
    val id: Long,
    val timestamp: Long,
    val username: String,
    val photo: Long,
    val count: Int,
    val note: String,
    val demolisher: Demolisher,
    val gps_coordinates: String,
    val city: String
)
