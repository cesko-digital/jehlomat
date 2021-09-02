package model

import kotlinx.serialization.Serializable

@Serializable
data class UserInfo(
    val username: String,
    val email: String,
    val phone_number: String?,
    val verified: Boolean
)

fun UserInfo.toUser() = User(
    username = username,
    password = "",
    email = email,
    phone_number = phone_number,
    verified = verified
)
