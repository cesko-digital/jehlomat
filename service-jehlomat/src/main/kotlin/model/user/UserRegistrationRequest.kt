package model.user

import kotlinx.serialization.Serializable

@Serializable
data class UserRegistrationRequest(
    val email: String
)
