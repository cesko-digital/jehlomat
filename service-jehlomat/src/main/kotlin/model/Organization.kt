package model

import kotlinx.serialization.Serializable

@Serializable
data class Organization(
    val name: String,
    val administrator: UserInfo,
    val teams: List<Team>,
    var verified: Boolean
)
