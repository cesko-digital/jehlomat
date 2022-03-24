package model.location

import kotlinx.serialization.Serializable
import org.ktorm.entity.Entity

@Serializable
data class Location(
    val id: Int,
    val okres: String,
    val okresName: String,
    val obec: Int?,
    val obecName: String?,
    val mestkaCast: Int?,
    val mestkaCastName: String?
)
