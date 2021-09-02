package model

import kotlinx.serialization.Serializable

@Serializable
data class UserInfo(
    val username: String,
    val email: String,
    val verified: Boolean
)

fun UserInfo.toUser() = User(
    username = username,
    password = "",
    email = email,
    verified = verified
)
