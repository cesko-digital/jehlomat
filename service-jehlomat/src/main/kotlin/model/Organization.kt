package model

import kotlinx.serialization.Serializable

@Serializable
data class Organization(
    val name: String,
    val administrator: UserInfo,
)
