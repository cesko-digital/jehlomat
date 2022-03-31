package model.syringe

import kotlinx.serialization.Serializable
import model.Demolisher
import model.location.Location
import model.Syringe
import model.user.UserInfo

@Serializable
data class SyringeCreateRequest (
    val createdAt: Long,
    val photo: String?,
    val count: Int,
    val note: String,
    val gps_coordinates: String
)

fun SyringeCreateRequest.toSyringe(location: Location, createdBy: UserInfo?) = Syringe(
    id = "",
    createdAt = this.createdAt,
    createdBy = createdBy,
    reservedTill = null,
    reservedBy = null,
    demolishedAt = null,
    demolishedBy = null,
    demolisherType = Demolisher.NO,
    photo = this.photo ?: "",
    count = this.count,
    note = this.note,
    gps_coordinates = this.gps_coordinates,
    location = location,
    demolished = false
)