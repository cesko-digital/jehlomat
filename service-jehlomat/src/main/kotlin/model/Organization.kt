package model

import kotlinx.serialization.Serializable

@Serializable
data class Organization(
    val id: Int,
    val name: String,
    val verified: Boolean
)
