package model

import kotlinx.serialization.Serializable

@Serializable
data class UserInfo(
    val username: String,
    val email: String,
    val organization: String?,
    val phone_number: String?,
    val verified: Boolean
)

fun UserInfo.toUser() = User(
    username = username,
    password = "",
    email = email,
    organization = organization,
    phone_number = phone_number,
    verified = verified
)
