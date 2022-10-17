package services

import api.LocationTable
import api.SyringeTable
import api.UserTable
import model.Role
import model.location.Location
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
        val orgLocations = orgTeams.flatMap { team -> team.locations }

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

        if (orgLocations.isEmpty()) {
            return limitation
        } else {
            return (
                limitation
                // from anonymous users and still waiting and not assigned to anyone in their org locations
                or (
                    (SyringeTable.reservedTill.isNull() or (SyringeTable.reservedTill less LocalDateTime.now().toEpochSecond(ZoneOffset.UTC)))
                    and SyringeTable.demolishedAt.isNull()
                    and SyringeTable.createdBy.isNull()
                    and createLocationQuery(orgLocations)
                )
            )
        }
    }

    private fun addTeamLimitation(createdByUserAlias: UserTable): ColumnDeclaring<Boolean> {
        // created by current user
        val createdByCurrentUser = (createdByUserAlias.userId eq user.id)

        var teamLocations: List<Location>? = null
        if (user.teamId != null) {
            val team = databaseService.selectTeamById(user.teamId)
            if (team != null) {
                teamLocations = team.locations
            }
        }

        if (teamLocations != null && teamLocations.isNotEmpty()) {
            return (
                createdByCurrentUser
                // from anonymous users and still waiting and not assigned to anyone in their team locations
                or (
                    (SyringeTable.reservedTill.isNull() or (SyringeTable.reservedTill less LocalDateTime.now().toEpochSecond(ZoneOffset.UTC)))
                    and SyringeTable.demolishedAt.isNull()
                    and SyringeTable.createdBy.isNull()
                    and createLocationQuery(teamLocations)
                )
            )
        } else {
            return createdByCurrentUser
        }
    }

    private fun createLocationQuery(locations: List<Location>): ColumnDeclaring<Boolean> {
        val okresIdList = locations.map { l -> l.okres }.toList()
        var query: ColumnDeclaring<Boolean> = LocationTable.okres.inList(okresIdList)

        val obecIdList = locations.mapNotNull { l -> l.obec }.toList()
        if (obecIdList.isNotEmpty()) {
            query = query or (LocationTable.obec.isNotNull() and LocationTable.obec.inList(obecIdList))
        }

        val mestskaCastIdList = locations.mapNotNull { l -> l.mestkaCast }.toList()
        if (mestskaCastIdList.isNotEmpty()) {
            query = query or (LocationTable.mestka_cast.isNotNull() and LocationTable.mestka_cast.inList(mestskaCastIdList))
        }

        return query
    }
}