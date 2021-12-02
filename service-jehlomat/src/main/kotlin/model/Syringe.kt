package model

import kotlinx.serialization.Serializable
import utils.UnchangeableByPut

@Serializable
data class Syringe(
    @UnchangeableByPut val id: String,
    @UnchangeableByPut val timestamp: Long,
    @UnchangeableByPut val userId: Int?,
    @UnchangeableByPut val photo: String,
    @UnchangeableByPut val count: Int,
    @UnchangeableByPut val note: String,
    val demolisher: Demolisher,
    @UnchangeableByPut val gps_coordinates: String,
    val demolished: Boolean
)
