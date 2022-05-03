package model.user

import kotlinx.serialization.Serializable

@Serializable
data class UserDetail(
    val id: Int,
    val email: String,
    val username: String,
    val status: UserStatus,
    val organizationId: Int,
    val teamId: Int?,
    val isAdmin: Boolean
)
