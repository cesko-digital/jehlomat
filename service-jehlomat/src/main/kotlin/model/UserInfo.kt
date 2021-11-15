package model

import kotlinx.serialization.Serializable

@Serializable
data class UserInfo(
    val id: Int,
    val email: String,
    val verified: Boolean,
    val organizationId: Int,
    val teamId: Int,
    val isAdmin: Boolean
)

