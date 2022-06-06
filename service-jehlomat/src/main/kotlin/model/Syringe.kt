package model

import kotlinx.serialization.Serializable
import model.location.Location
import model.syringe.SyringeFlat
import model.syringe.SyringeStatus
import model.user.UserInfo

@Serializable
data class Syringe (
    val id: String,
    val createdAt: Long,
    val createdBy: UserInfo?,
    val reservedTill: Long?,
    val reservedBy: UserInfo?,
    val demolishedAt: Long?,
    val demolishedBy: UserInfo?,
    val demolisherType: Demolisher,
    val photo: String,
    val count: Int,
    val note: String,
    val gps_coordinates: String,
    val location: Location,
    val demolished: Boolean
)

fun Syringe.toSyringeInfo() = SyringeInfo(
    id = id,
    createdAt = createdAt,
    photo = photo,
    count = count,
    note = note,
    gps_coordinates = gps_coordinates,
    location = location,
    status = SyringeStatus.fromDbRecord(this)
)

fun Syringe.toFlatObject() = SyringeFlat(
    id = id,
    createdAt = createdAt,
    createdById = createdBy?.id,
    reservedTill = reservedTill,
    reservedById = reservedBy?.id,
    demolishedAt = demolishedAt,
    demolishedById = demolishedBy?.id,
    demolisherType = demolisherType,
    photo = photo,
    count = count,
    note = note,
    gps_coordinates = gps_coordinates,
    locationId = location.id,
    demolished = demolished
)