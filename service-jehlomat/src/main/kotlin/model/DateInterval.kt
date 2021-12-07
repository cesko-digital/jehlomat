package model

import kotlinx.serialization.Serializable

@Serializable
data class DateInterval (
    val from: Long?,
    val to: Long?
)