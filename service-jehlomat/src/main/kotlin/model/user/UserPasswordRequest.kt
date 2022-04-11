package model.user

import kotlinx.serialization.Serializable

@Serializable
data class UserPasswordRequest(
    val oldPassword: String,
    val newPassword: String
)
