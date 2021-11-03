package service

import api.*
import model.*
import org.ktorm.database.Database
import org.ktorm.database.asIterable
import org.ktorm.dsl.*
import org.ktorm.schema.ColumnDeclaring
import org.ktorm.support.postgresql.bulkInsert
import org.ktorm.support.postgresql.insertOrUpdate


interface DatabaseService {
    fun insertSyringe(syringe: Syringe)
    fun insertUser(user: User)
    fun insertTeam(team: Team)
    fun getObec(gpsCoordinates: String): String
    fun getMC(gpsCoordinates: String): String
    fun getOkres(gpsCoordinates: String): String
    fun resolveNearestTeam(gpsCoordinates: String): Team
    fun cleanLocation(): Int
    fun cleanTeams(): Int
}


class DatabaseServiceImpl(
    private val host: String = System.getenv("DATABASE_HOST"),
    private val port: String = System.getenv("DATABASE_PORT"),
    private val database: String = System.getenv("DATABASE_NAME"),
    private val user: String = System.getenv("DATABASE_USERNAME"),
    private val password: String = System.getenv("PGPASSWORD") ?: ""
) : DatabaseService {
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
            .innerJoin(UserTeamTable, on = UserTeamTable.team_name eq TeamTable.name)
            .innerJoin(UserTable, on = UserTeamTable.user_email eq UserTable.email)
            .select()
            .orderBy(TeamTable.name.asc())
            .map { row -> TeamTable.createEntity(row) }
    }

    fun selectOrganizations(): List<Organization> {
        return databaseInstance
            .from(OrganizationTable)
            .innerJoin(AdminOrganizationTable, on = AdminOrganizationTable.organization_name eq OrganizationTable.name)
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
            set(it.organization_name, team.organization)
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
            set(it.gpsCoordinates, syringe.gps_coordinates)
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

    override fun insertTeam(team: Team) {
        databaseInstance.insertOrUpdate(LocationTable) {
            set(it.mestka_cast, team.location.mestkaCast)
            set(it.okres, team.location.okres)
            set(it.obec, team.location.obec)
            onConflict { doNothing() }
        }

        val locationId: Int = databaseInstance
            .from(LocationTable)
            .select()
            .where(
                (LocationTable.mestka_cast eq team.location.mestkaCast)
                        and (LocationTable.obec eq team.location.obec)
                        and (LocationTable.okres eq team.location.okres)
            )
            .map { it.getInt("id") }.first()

        databaseInstance.insertOrUpdate(TeamTable) {
            set(it.organization_name, team.organization)
            set(it.location_id, locationId)
            set(it.name, team.name)
            onConflict { doNothing() }
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

    fun postgisLocation(table: String, gpsCoordinates: String, column: String): String {
        val names = databaseInstance.useConnection { conn ->
            val sql =
                "SELECT $column FROM $table WHERE ST_Within('POINT( $gpsCoordinates )'::geometry, $table.wkb_geometry)"

            conn.prepareStatement(sql).use { statement ->
                statement.executeQuery().asIterable().map { it.getString(1) }
            }
        }

        return names.firstOrNull() ?: ""
    }

    override fun getObec(gpsCoordinates: String): String {
        return postgisLocation("sph_obec", gpsCoordinates, "nazev_lau2")
    }

    override fun getMC(gpsCoordinates: String): String {
        return postgisLocation("sph_mc", gpsCoordinates, "nazev_mc")
    }

    override fun getOkres(gpsCoordinates: String): String {
        return postgisLocation("sph_okres", gpsCoordinates, "nazev_lau1")
    }

    fun selectLocation(gpsCoordinates: String): Location {
        fun query(condition: ColumnDeclaring<Boolean>): Location? {
            return databaseInstance.from(LocationTable)
                .select()
                .where { condition }
                .map { row ->
                    Location(
                        id = row.getInt("id"),
                        okres = row.getString("okres")!!,
                        obec = row.getString("obec")!!,
                        mestkaCast = row.getString("mestka_cast")!!
                    )
                }
                .firstOrNull()
        }

        val obec = getObec(gpsCoordinates)
        val mc = getMC(gpsCoordinates)
        val okres = getOkres(gpsCoordinates)

        return (query((LocationTable.mestka_cast eq mc) and (LocationTable.obec eq obec) and (LocationTable.okres eq okres))
            ?: run { query((LocationTable.obec eq obec) and (LocationTable.okres eq okres)) }
            ?: run { query(LocationTable.okres eq okres) })!!
    }

    override fun resolveNearestTeam(gpsCoordinates: String): Team {
        val location = selectLocation(gpsCoordinates)

        return databaseInstance
            .from(TeamTable)
            .select()
            .where { TeamTable.location_id eq location.id }
            .map {
                    row -> Team(
                        name=row.getString("name")!!,
                        location=location,
                        usernames=listOf(),
                        organization=row.getString("organization_name")!!,
                    )
            }
            .first<Team>()
    }

    override fun cleanLocation(): Int {
        return databaseInstance.deleteAll(LocationTable)
    }

    override fun cleanTeams(): Int {
        return databaseInstance.deleteAll(TeamTable)
    }
}
