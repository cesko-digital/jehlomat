package model

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val username: String,
    val password: String,
    val email: String,
    val verified: Boolean
)

fun User.toUserInfo() = UserInfo(
    username = username,
    email = email,
    verified = verified
)
