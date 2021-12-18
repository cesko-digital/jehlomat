package model.user

import kotlinx.serialization.Serializable

@Serializable
data class UserVerificationRequest(
    val code: String,
    val email: String,
    val username: String,
    val password: String
)
