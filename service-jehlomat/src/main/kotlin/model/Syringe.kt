package model

import kotlinx.serialization.Serializable
import utils.UnchangeableByPut

@Serializable
data class Syringe(
    @UnchangeableByPut val id: String,
    @UnchangeableByPut val createdAt: Long,
    @UnchangeableByPut val createdBy: Int?,
    val reservedAt: Long?,
    val reservedBy: Int?,
    val demolishedAt: Long?,
    val demolishedBy: Int?,
    val demolisherType: Demolisher,
    @UnchangeableByPut val photo: String,
    @UnchangeableByPut val count: Int,
    @UnchangeableByPut val note: String,
    @UnchangeableByPut val gps_coordinates: String,
    val demolished: Boolean
)
