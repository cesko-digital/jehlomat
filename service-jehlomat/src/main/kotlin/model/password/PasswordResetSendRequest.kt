package model.password

import kotlinx.serialization.Serializable

@Serializable
data class PasswordResetSendRequest(
    val email: String
)
