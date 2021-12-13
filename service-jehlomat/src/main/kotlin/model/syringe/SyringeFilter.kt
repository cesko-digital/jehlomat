package model.syringe

import kotlinx.serialization.Serializable
import model.DateInterval

@Serializable
data class SyringeFilter (
    val locationIds: Set<Int>?,
    val createdAt: DateInterval?,
    val createdBy: SyringeFinder?,
    val demolishedAt: DateInterval?,
    val status: SyringeStatus?
)