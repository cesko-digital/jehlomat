package services

import api.SyringeTable
import api.UserTable
import model.Role
import model.user.User
import org.ktorm.dsl.*
import org.ktorm.schema.ColumnDeclaring
import java.time.LocalDateTime
import java.time.ZoneOffset

class SyringeRoleLimitation(val databaseService: DatabaseService, roles: Set<Role>, val user: User) {

    val role: Role?
    init {
        role = if (roles.contains(Role.SuperAdmin)) {
            Role.SuperAdmin
        } else if (roles.contains(Role.OrgAdmin)) {
            Role.OrgAdmin
        } else if (roles.contains(Role.UserOwner)) {
            Role.UserOwner
        } else {
            null
        }
    }


    fun addLimitation(
        originalFilter: ColumnDeclaring<Boolean>,
        createdByUserAlias: UserTable,
        reservedByUserAlias: UserTable
    ): ColumnDeclaring<Boolean> {
        return when (role) {
            Role.SuperAdmin -> originalFilter
            Role.OrgAdmin -> addOrgLimitation(createdByUserAlias, reservedByUserAlias) and originalFilter
            Role.UserOwner -> addTeamLimitation(createdByUserAlias) and originalFilter
            else -> false and originalFilter
        }
    }

    private fun addOrgLimitation(
        createdByUserAlias: UserTable,
        reservedByUserAlias: UserTable
    ): ColumnDeclaring<Boolean> {
        val orgTeams = databaseService.selectTeamsByOrganizationId(user.organizationId)
        val orgLocationIds = orgTeams.flatMap { team -> team.locations }.map { location -> location.id }

        val limitation = (
            // created by org members
            (createdByUserAlias.organizationId eq user.organizationId)
            // reserved by org members
            or (
                (SyringeTable.reservedTill greaterEq LocalDateTime.now().toEpochSecond(ZoneOffset.UTC))
                and (reservedByUserAlias.organizationId eq user.organizationId)
                and SyringeTable.demolishedBy.isNull()
                and SyringeTable.createdBy.isNull()
            )
        )

        if (orgLocationIds.isEmpty()) {
            return limitation
        } else {
            return (
                limitation
                // from anonymous users and still waiting and not assigned to anyone in their org locations
                or (
                    (SyringeTable.reservedTill.isNull() or (SyringeTable.reservedTill less LocalDateTime.now().toEpochSecond(ZoneOffset.UTC)))
                    and SyringeTable.demolishedAt.isNull()
                    and SyringeTable.createdBy.isNull()
                    and SyringeTable.locationId.inList(orgLocationIds)
                )
            )
        }
    }

    private fun addTeamLimitation(createdByUserAlias: UserTable): ColumnDeclaring<Boolean> {
        // created by current user
        val createdByCurrentUser = (createdByUserAlias.userId eq user.id)

        var teamLocationIds: List<Int>? = null
        if (user.teamId != null) {
            val team = databaseService.selectTeamById(user.teamId)
            if (team != null) {
                teamLocationIds = team.locations.map { location -> location.id }
            }
        }

        if (teamLocationIds != null && teamLocationIds.isNotEmpty()) {
            return (
                createdByCurrentUser
                // from anonymous users and still waiting and not assigned to anyone in their team locations
                or (
                    (SyringeTable.reservedTill.isNull() or (SyringeTable.reservedTill less LocalDateTime.now().toEpochSecond(ZoneOffset.UTC)))
                    and SyringeTable.demolishedAt.isNull()
                    and SyringeTable.createdBy.isNull()
                    and SyringeTable.locationId.inList(teamLocationIds)
                )
            )
        } else {
            return createdByCurrentUser
        }
    }
}