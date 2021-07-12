package model

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val username: String,
    val password: String,
    val email: String,
    val organization: String?,
    val phone_number: String?,
    val verified: Boolean
)

fun User.toUserInfo() = UserInfo(
    username = username,
    email = email,
    organization = organization,
    phone_number = phone_number,
    verified = verified
)
