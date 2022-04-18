package model.password

import kotlinx.serialization.Serializable

@Serializable
data class PasswordResetTestRequest(
    val code: String,
    val email: String
)
