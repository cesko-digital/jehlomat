package model.user

import kotlinx.serialization.Serializable
import model.Role
import utils.AuthRole
import utils.UnchangeableByPut

@Serializable
data class User(
    @UnchangeableByPut val id: Int,
    @AuthRole(Role.UserOwner) val email: String,
    @AuthRole(Role.UserOwner) val username: String,
    @AuthRole(Role.UserOwner) val password: String,
    @UnchangeableByPut val status: UserStatus,
    @UnchangeableByPut val verificationCode: String,
    @UnchangeableByPut val organizationId: Int,
    @AuthRole(Role.OrgAdmin) val teamId: Int?,
    @AuthRole(Role.OrgAdmin) val isAdmin: Boolean
)

fun User.toUserInfo(includeEmail: Boolean = false) = UserInfo(
    id = id,
    username = username,
    organizationId = organizationId,
    teamId = teamId,
    email = when (includeEmail) {
        true -> email
        else -> "---"
    },
    isAdmin = isAdmin
)

fun User.toUserDetail(isSuperAdmin: Boolean) = UserDetail(
    id, email, username, status, organizationId, teamId, isAdmin, isSuperAdmin
)
