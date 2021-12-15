package model

import kotlinx.serialization.Serializable
import utils.AuthRole
import utils.UnchangeableByPut

@Serializable
data class User(
    @UnchangeableByPut val id: Int,
    @AuthRole(Role.UserOwner) val email: String,
    @AuthRole(Role.UserOwner) val username: String,
    @AuthRole(Role.UserOwner, FieldComparisonType.PASSWORD) val password: String,
    @UnchangeableByPut val verified: Boolean,
    @UnchangeableByPut val organizationId: Int,
    @AuthRole(Role.OrgAdmin) val teamId: Int?,
    @AuthRole(Role.OrgAdmin) val isAdmin: Boolean
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
