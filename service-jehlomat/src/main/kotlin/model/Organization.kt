package model

import kotlinx.serialization.Serializable
import utils.AuthRole
import utils.UnchangeableByPut

@Serializable
data class Organization(
    @UnchangeableByPut val id: Int,
    @AuthRole(Role.OrgAdmin) val name: String,
    @UnchangeableByPut val verified: Boolean
)
