package model.team

import kotlinx.serialization.Serializable
import model.location.LocationId
import model.Role
import utils.AuthRole
import utils.UnchangeableByPut

@Serializable
data class TeamRequest (
    @UnchangeableByPut val id: Int,
    @AuthRole(Role.OrgAdmin) val name: String,
    @AuthRole(Role.OrgAdmin) val locationIds: List<LocationId>,
    @AuthRole(Role.SuperAdmin) val organizationId: Int
)