package model

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val email: String,
    val password: String,
    val verified: Boolean,
    val teamName: String
)

fun User.toUserInfo() = UserInfo(
    email = email,
    teamName = teamName,
    verified = verified
)
