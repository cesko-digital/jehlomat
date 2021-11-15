package model

import kotlinx.serialization.Serializable

@Serializable
data class Syringe(
    val id: Int,
    val timestamp: Long,
    val userId: Int,
    val photo: String,
    val count: Int,
    val note: String,
    val demolisher: Demolisher,
    val gps_coordinates: String,
    val demolished: Boolean
)
