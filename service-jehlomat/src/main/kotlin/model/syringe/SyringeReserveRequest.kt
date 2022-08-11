package model.syringe

import kotlinx.serialization.Serializable

@Serializable
data class SyringeReserveRequest(
    val reservedTill: Long
)
