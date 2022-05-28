package model.syringe

import kotlinx.serialization.Serializable
import model.Demolisher
import utils.UnchangeableByPut

@Serializable
data class SyringeFlat (
    @UnchangeableByPut
    val id: String,
    @UnchangeableByPut val createdAt: Long,
    @UnchangeableByPut val createdById: Int?,
    val reservedTill: Long?,
    val reservedById: Int?,
    val demolishedAt: Long?,
    val demolishedById: Int?,
    val demolisherType: Demolisher,
    @UnchangeableByPut val photo: String,
    @UnchangeableByPut val count: Int,
    @UnchangeableByPut val note: String,
    @UnchangeableByPut val gps_coordinates: String,
    @UnchangeableByPut val locationId: Int,
    val demolished: Boolean
)