package model

import kotlinx.serialization.Serializable

@Serializable
data class UserInfo(
    val email: String,
    val teamName: String,
    val verified: Boolean
)

fun UserInfo.toUser() = User(
    password = "",
    email = email,
    teamName = teamName,
    verified = verified
)
