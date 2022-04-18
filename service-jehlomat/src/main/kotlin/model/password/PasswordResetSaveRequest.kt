package model.password

import kotlinx.serialization.Serializable

@Serializable
data class PasswordResetSaveRequest(
    val code: String,
    val email: String,
    val password: String,
)
