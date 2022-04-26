package model.user

import kotlinx.serialization.Serializable

@Serializable
data class UserInfo(
    val id: Int,
    val username: String,
    val organizationId: Int,
    val email: String,
    val teamId: Int?,
    val isAdmin: Boolean
)

