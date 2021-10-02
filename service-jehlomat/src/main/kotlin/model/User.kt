package model

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val email: String,
    val password: String,
    val verified: Boolean
)

fun User.toUserInfo() = UserInfo(
    email = email,
    verified = verified
)
