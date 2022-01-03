package model

import kotlinx.serialization.Serializable
import utils.AuthRole
import utils.UnchangeableByPut

@Serializable
data class Team(
    @UnchangeableByPut val id: Int,
    @AuthRole(Role.OrgAdmin) val name: String,
    @AuthRole(Role.OrgAdmin) val location: Location,
    @AuthRole(Role.SuperAdmin) val organizationId: Int
)
