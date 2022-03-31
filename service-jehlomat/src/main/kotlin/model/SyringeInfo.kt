package model

import kotlinx.serialization.Serializable
import model.location.Location
import model.syringe.SyringeStatus

@Serializable
data class SyringeInfo (
    val id: String,
    val createdAt: Long,
    val photo: String,
    val count: Int,
    val note: String,
    val gps_coordinates: String,
    val location: Location,
    val status: SyringeStatus
)