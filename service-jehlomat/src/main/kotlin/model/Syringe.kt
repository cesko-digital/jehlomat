package model

data class Syringe(
    val id: Long,
    val timestamp: Long,
    val username: String,
    val photo: Long,
    val count: Int,
    val note: String,
    val demolisher: Demolisher,
    val gps_coordinates: String,
)
