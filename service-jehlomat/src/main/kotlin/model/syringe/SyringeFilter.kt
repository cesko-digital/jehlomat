package model.syringe

import kotlinx.serialization.Serializable
import model.DateInterval
import model.location.LocationId

@Serializable
data class SyringeFilter (
    val locationIds: Set<LocationId>?,
    val createdAt: DateInterval?,
    val createdBy: SyringeFinder?,
    val demolishedAt: DateInterval?,
    val status: SyringeStatus?
)