package model

import kotlinx.serialization.Serializable

@Serializable
data class Team(
    val name: String,
    val administrator: UserInfo,
    val location: Location,
    val usernames: List<UserInfo>
)
