package model.user

import kotlinx.serialization.Serializable
import model.FieldComparisonType
import model.Role
import utils.AuthRole
import utils.UnchangeableByPut

@Serializable
data class User(
    @UnchangeableByPut val id: Int,
    @AuthRole(Role.UserOwner) val email: String,
    @AuthRole(Role.UserOwner) val username: String,
    @AuthRole(Role.UserOwner) val password: String,
    @UnchangeableByPut val verified: Boolean,
    @UnchangeableByPut val verificationCode: String,
    @UnchangeableByPut val organizationId: Int,
    @AuthRole(Role.OrgAdmin) val teamId: Int?,
    @AuthRole(Role.OrgAdmin) val isAdmin: Boolean
)

fun User.toUserInfo() = UserInfo(
    id = id,
    username = username,
    organizationId = organizationId,
    teamId = teamId,
    isAdmin = isAdmin
)

fun User.toUserDetail() = UserDetail(
    id, email, username, verified, organizationId, teamId, isAdmin
)
