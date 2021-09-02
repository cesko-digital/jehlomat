package model

import kotlinx.serialization.Serializable

@Serializable
data class Organization(
    val name: String,
    val administrator: UserInfo,
    val location: String,
    val usernames: List<UserInfo>
)
