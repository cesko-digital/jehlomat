package service

import api.*
import model.*
import org.ktorm.database.Database
import org.ktorm.dsl.*
import org.ktorm.entity.sequenceOf
import org.ktorm.support.postgresql.InsertOrUpdateExpression
import org.ktorm.support.postgresql.bulkInsert
import org.ktorm.support.postgresql.insertOrUpdate


interface DatabaseService {
    fun insertSyringe(syringe: Syringe)
    fun insertUser(user: User)
}


class DatabaseServiceImpl(
    private val host: String=System.getenv("DATABASE_HOST"),
    private val port: String=System.getenv("DATABASE_PORT"),
    private val database: String=System.getenv("DATABASE_NAME"),
    private val user: String=System.getenv("DATABASE_USERNAME"),
    private val password: String=System.getenv("DATABASE_PASSWORD") ?: ""
): DatabaseService {
    private val databaseInstance = Database.connect(
        "jdbc:postgresql://$host:$port/$database", user = user, password = password
    )

    fun selectSyringeById(id: Int): Syringe {
        return databaseInstance
            .from(SyringeTable)
            .select()
            .where { SyringeTable.id eq id }
            .map { row -> SyringeTable.createEntity(row) }
            .first<Syringe>()
    }

    fun selectSyringes(): List<Syringe> {
        return databaseInstance
            .from(SyringeTable)
            .select()
            .orderBy(SyringeTable.id.asc())
            .map { row -> SyringeTable.createEntity(row) }
    }

    fun selectTeams(): List<Team> {
        return databaseInstance
            .from(TeamTable)
            .innerJoin(UserTeamTable, on=UserTeamTable.team_name eq TeamTable.name)
            .innerJoin(UserTable, on=UserTeamTable.user_email eq UserTable.email)
            .select()
            .orderBy(TeamTable.name.asc())
            .map { row -> TeamTable.createEntity(row) }
    }

    fun selectOrganizations(): List<Organization> {
        return databaseInstance
            .from(OrganizationTable)
            .innerJoin(AdminOrganizationTable, on=AdminOrganizationTable.organization_name eq OrganizationTable.name)
            .select()
            .orderBy(OrganizationTable.name.asc())
            .map { row ->
                Organization(
                    row[OrganizationTable.name]!!,
                    UserInfo(
                        row[AdminOrganizationTable.admin_email]!!,
                        false,
                    ),
                    row[OrganizationTable.verified]!!
                )
            }
    }

     fun updateUser(user: User) {
        databaseInstance.update(UserTable) {
            set(it.email, user.email)
            set(it.password, user.password)
            set(it.verified, user.verified)
        }
    }

    fun updateOrganization(organization: Organization) {
        databaseInstance.update(OrganizationTable) {
            set(it.name, organization.name)
        }
        databaseInstance.update(AdminOrganizationTable) {
            set(it.organization_name, organization.name)
            set(it.admin_email, organization.administrator.email)
        }
    }

    fun updateTeam(team: Team) {
        databaseInstance.update(TeamTable) {
            set(it.name, team.name)
            set(it.location_id, team.location.id)
            set(it.organization_name, team.organization.name)
        }
    }

    override fun insertSyringe(syringe: Syringe) {
        databaseInstance.insertAndGenerateKey(SyringeTable) {
            set(it.timestamp, syringe.timestamp)
            set(it.email, syringe.email)
            set(it.photo, syringe.photo)
            set(it.count, syringe.count)
            set(it.note, syringe.note)
            set(it.demolisherType, syringe.demolisher)
            set(it.gps_coordinates, syringe.gps_coordinates)
        }
    }

    override fun insertUser(user: User) {
        databaseInstance.insert(UserTable) {
            set(it.email, user.email)
            set(it.password, user.password)
            set(it.verified, user.verified)
        }
    }

    fun insertOrganization(organization: Organization) {
        databaseInstance.insertOrUpdate(OrganizationTable) {
            set(it.name, organization.name)
        }
        databaseInstance.insertOrUpdate(AdminOrganizationTable) {
            set(it.admin_email, organization.administrator.email)
            set(it.organization_name, organization.name)
        }
    }

    fun insertTeam(team: Team) {
        databaseInstance.insertOrUpdate(LocationTable) {
            set(it.mestka_cast, team.location.mestkaCast)
            set(it.okres, team.location.okres)
            set(it.mesto, team.location.mesto)
        }
        databaseInstance.insertOrUpdate(TeamTable) {
            set(it.organization_name, team.organization.name)
            set(it.location_id, team.location.id)
            set(it.name, team.name)
        }
    }

    fun insertUsersToTeam(team: Team, users: List<User>) {
        databaseInstance.bulkInsert(UserTeamTable) {
            users.map { user ->
                item {
                    set(it.team_name, team.name)
                    set(it.user_email, user.email)
                }
            }
        }
    }

    fun deleteSyringe(id: Int) {
        databaseInstance.delete(SyringeTable) { it.id eq id }
    }

    fun deleteTeam(name: String) {
        databaseInstance.delete(TeamTable) { it.name eq name }
    }

    fun deleteAdminFromOrganization(email: String, orgName: String) {
        databaseInstance.delete(AdminOrganizationTable) {
            (it.admin_email eq email) and (it.organization_name eq orgName)
        }
    }

    fun deleteUserFromTeam(email: String, teamName: String) {
        databaseInstance.delete(UserTeamTable) {
            (it.user_email eq email) and (it.team_name eq teamName)
        }
    }
}
