package model

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: Int,
    val email: String,
    val username: String,
    val password: String,
    val verified: Boolean,
    val organizationId: Int,
    val teamId: Int?,
    val isAdmin: Boolean
)

fun User.toUserInfo() = UserInfo(
    id = id,
    email = email,
    username = username,
    verified = verified,
    organizationId = organizationId,
    teamId = teamId,
    isAdmin = isAdmin
)
