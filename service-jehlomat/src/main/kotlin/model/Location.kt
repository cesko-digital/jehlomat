package model

import kotlinx.serialization.Serializable
import org.ktorm.entity.Entity

@Serializable
data class Location(
    val id: Int,
    val okres: String,
    val obec: Int,
    val mestkaCast: Int
)
