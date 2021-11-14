package services

import api.*
import model.*
import org.ktorm.database.Database
import org.ktorm.database.asIterable
import org.ktorm.dsl.*
import org.ktorm.schema.ColumnDeclaring
import org.ktorm.support.postgresql.insertOrUpdate
import utils.hashPassword


interface DatabaseService {
    fun insertSyringe(syringe: Syringe): Int
    fun selectSyringeById(id: Int): Syringe?
    fun deleteSyringe(id: Int)
    fun updateSyringe(syringe: Syringe)
    fun selectSyringes(): List<Syringe>
    fun selectSyringes(
        from: Long,
        to: Long,
        teamId: Int?,
        demolisher: Demolisher,
        gpsCoordinates: String,
        demolished: Boolean,
    ): List<Syringe>

    fun insertTeam(team: Team): Int
    fun updateTeam(team: Team)
    fun selectTeams(): List<Team>
    fun selectTeamByName(name: String): Team?
    fun resolveNearestTeam(gpsCoordinates: String): Team
    fun getObec(gpsCoordinates: String): String
    fun getMC(gpsCoordinates: String): String
    fun getOkres(gpsCoordinates: String): String

    fun insertUser(user: User): Int
    fun updateUser(user: User)
    fun selectUserByEmail(email: String): User?

    fun selectOrganizationByName(name: String): Organization?
    fun selectOrganizations(): List<Organization>
    fun updateOrganization(organization: Organization)
    fun insertOrganization(organization: Organization): Int
    fun deleteOrganization(organization: Organization)

    fun cleanLocation(): Int
    fun cleanTeams(): Int
    fun cleanUsers(): Int
    fun cleanOrganizations(): Int
    fun cleanSyringes(): Int
}


class DatabaseServiceImpl(
    host: String = System.getenv("DATABASE_HOST"),
    port: String = System.getenv("DATABASE_PORT"),
    database: String = System.getenv("DATABASE_NAME"),
    user: String = System.getenv("DATABASE_USERNAME"),
    password: String = System.getenv("PGPASSWORD") ?: ""
) : DatabaseService {
    private val databaseInstance = Database.connect(
        "jdbc:postgresql://$host:$port/$database", user = user, password = password
    )

    override fun selectSyringeById(id: Int): Syringe? {
        return databaseInstance
            .from(SyringeTable)
            .select()
            .where { SyringeTable.id eq id }
            .map { row -> SyringeTable.createEntity(row) }
            .firstOrNull()
    }

    override fun selectSyringes(): List<Syringe> {
        return databaseInstance
            .from(SyringeTable)
            .select()
            .orderBy(SyringeTable.id.asc())
            .map { row -> SyringeTable.createEntity(row) }
    }

    override fun selectSyringes(
        from: Long,
        to: Long,
        teamId: Int?,
        demolisher: Demolisher,
        gpsCoordinates: String,
        demolished: Boolean,
    ): List<Syringe> {

        var filter = (
                (SyringeTable.timestamp greaterEq from)
                and (SyringeTable.timestamp lessEq to)
                and (SyringeTable.demolisherType eq demolisher.name)
                and (gpsCoordinates.isBlank() or (SyringeTable.gpsCoordinates eq gpsCoordinates))
                and (SyringeTable.demolished eq demolished)
                )

        if (teamId != null) {
            filter = filter and(SyringeTable.teamId eq teamId)
        }

        return databaseInstance
            .from(SyringeTable)
            .select()
            .where { filter }
            .orderBy(SyringeTable.id.asc())
            .map { row -> SyringeTable.createEntity(row) }
    }

    override fun selectUserByEmail(email: String): User? {
        return databaseInstance
            .from(UserTable)
            .select()
            .where { UserTable.email eq email }
            .map { row -> UserTable.createEntity(row) }
            .firstOrNull()
    }

    override fun selectTeams(): List<Team> {
        return databaseInstance
            .from(TeamTable)
            .innerJoin(LocationTable, LocationTable.id eq TeamTable.location_id)
            .select()
            .orderBy(TeamTable.name.asc())
            .map { row -> Team(
                id = row[TeamTable.teamId]!!,
                name = row[TeamTable.name]!!,
                location = Location(
                    id = row[LocationTable.id]!!,
                    obec = row[LocationTable.obec]!!,
                    okres = row[LocationTable.okres]!!,
                    mestkaCast = row[LocationTable.mestka_cast]!!,
                ),
                organizationId = row[TeamTable.organization_id]!!
            ) }
    }

    override fun selectTeamByName(name: String): Team? {
        return databaseInstance
            .from(TeamTable)
            .innerJoin(LocationTable, LocationTable.id eq TeamTable.location_id)
            .select()
            .where { TeamTable.name eq name }
            .map { row -> Team(
                id = row[TeamTable.teamId]!!,
                name = row[TeamTable.name]!!,
                location = Location(
                    id = row[LocationTable.id]!!,
                    obec = row[LocationTable.obec]!!,
                    okres = row[LocationTable.okres]!!,
                    mestkaCast = row[LocationTable.mestka_cast]!!,
                ),
                organizationId = row[TeamTable.organization_id]!!
            ) }
            .firstOrNull()
    }

    override fun selectOrganizations(): List<Organization> {
        return databaseInstance
            .from(OrganizationTable)
            .select()
            .orderBy(OrganizationTable.name.asc())
            .map { row -> OrganizationTable.createEntity(row) }
    }

    override fun updateUser(user: User) {
        databaseInstance.update(UserTable) {
            set(it.email, user.email)
            set(it.password, user.password.hashPassword())
            set(it.verified, user.verified)
            set(it.organizationId, user.organizationId)
            set(it.teamId, user.teamId)
            set(it.isAdmin, user.isAdmin)
        }
    }

    override fun selectOrganizationByName(name: String): Organization? {
        return databaseInstance
            .from(OrganizationTable)
            .select()
            .where { OrganizationTable.name eq name }
            .map { row -> OrganizationTable.createEntity(row) }
            .firstOrNull()
    }

    override fun updateOrganization(organization: Organization) {
        databaseInstance.update(OrganizationTable) {
            set(it.name, organization.name)
        }
    }

    override fun updateTeam(team: Team) {
        databaseInstance.update(TeamTable) {
            set(it.name, team.name)
            set(it.location_id, getLocationId(team))
            set(it.organization_id, team.organizationId)
        }
    }

    override fun insertSyringe(syringe: Syringe): Int {
        return databaseInstance.insertAndGenerateKey(SyringeTable) {
            set(it.timestamp, syringe.timestamp)
            set(it.teamId, syringe.teamId)
            set(it.photo, syringe.photo)
            set(it.count, syringe.count)
            set(it.note, syringe.note)
            set(it.demolisherType, syringe.demolisher.name)
            set(it.gpsCoordinates, syringe.gps_coordinates)
            set(it.demolished, syringe.demolished)
        } as Int
    }

    override fun updateSyringe(syringe: Syringe) {
        databaseInstance.update(SyringeTable) {
            set(it.id, syringe.id)
            set(it.timestamp, syringe.timestamp)
            set(it.teamId, syringe.teamId)
            set(it.photo, syringe.photo)
            set(it.count, syringe.count)
            set(it.note, syringe.note)
            set(it.demolisherType, syringe.demolisher.name)
            set(it.gpsCoordinates, syringe.gps_coordinates)
            set(it.demolished, syringe.demolished)
        }
    }

    override fun insertUser(user: User): Int {
        return databaseInstance.insertAndGenerateKey(UserTable) {
            set(it.email, user.email)
            set(it.password, user.password.hashPassword())
            set(it.verified, user.verified)
            set(it.organizationId, user.organizationId)
            set(it.teamId, user.teamId)
            set(it.isAdmin, user.isAdmin)
        } as Int
    }

    override fun insertOrganization(organization: Organization): Int {
        return databaseInstance.insertAndGenerateKey(OrganizationTable) {
            set(it.name, organization.name)
        } as Int
    }

    override fun deleteOrganization(organization: Organization) {
        databaseInstance.delete(OrganizationTable) { it.name eq organization.name }
    }

    override fun insertTeam(team: Team): Int {
        return databaseInstance.insertAndGenerateKey(TeamTable) {
            set(it.organization_id, team.organizationId)
            set(it.location_id, getLocationId(team))
            set(it.name, team.name)
        } as Int
    }

    private fun getLocationId(team: Team): Int {
        databaseInstance.insertOrUpdate(LocationTable) {
            set(it.mestka_cast, team.location.mestkaCast)
            set(it.okres, team.location.okres)
            set(it.obec, team.location.obec)
            onConflict { doNothing() }
        }

        return databaseInstance
            .from(LocationTable)
            .select()
            .where(
                (LocationTable.mestka_cast eq team.location.mestkaCast)
                        and (LocationTable.obec eq team.location.obec)
                        and (LocationTable.okres eq team.location.okres)
            )
            .map { it.getInt("location_id") }.first()
    }

    override fun deleteSyringe(id: Int) {
        databaseInstance.delete(SyringeTable) { it.id eq id }
    }

    fun deleteTeam(name: String) {
        databaseInstance.delete(TeamTable) { it.name eq name }
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
                        id = row.getInt("location_id"),
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
            .map { row ->
                Team(
                    id=row.getInt("team_id"),
                    name=row.getString("name")!!,
                    location=location,
                    organizationId=row.getInt("organization_id"),
                )
            }
            .first()
    }

    override fun cleanLocation(): Int {
        return databaseInstance.deleteAll(LocationTable)
    }

    override fun cleanTeams(): Int {
        return databaseInstance.deleteAll(TeamTable)
    }

    override fun cleanUsers(): Int {
        return databaseInstance.deleteAll(UserTable)
    }

    override fun cleanOrganizations(): Int {
        return databaseInstance.deleteAll(OrganizationTable)
    }

    override fun cleanSyringes(): Int {
        return databaseInstance.deleteAll(SyringeTable)
    }
}
