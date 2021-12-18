package model

import kotlinx.serialization.Serializable
import model.user.UserInfo
import utils.UnchangeableByPut

@Serializable
data class Syringe (
    @UnchangeableByPut val id: String,
    @UnchangeableByPut val createdAt: Long,
    @UnchangeableByPut val createdBy: UserInfo?,
    val reservedTill: Long?,
    val reservedBy: UserInfo?,
    val demolishedAt: Long?,
    val demolishedBy: UserInfo?,
    val demolisherType: Demolisher,
    @UnchangeableByPut val photo: String,
    @UnchangeableByPut val count: Int,
    @UnchangeableByPut val note: String,
    @UnchangeableByPut val gps_coordinates: String,
    @UnchangeableByPut val location: Location,
    val demolished: Boolean
)
