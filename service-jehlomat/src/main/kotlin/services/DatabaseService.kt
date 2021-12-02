package services

import api.*
import model.*
import org.ktorm.database.Database
import org.ktorm.database.asIterable
import org.ktorm.dsl.*
import org.ktorm.schema.ColumnDeclaring
import org.ktorm.support.postgresql.insertOrUpdate
import org.postgresql.util.PSQLException
import org.postgresql.util.PSQLState
import utils.hashPassword


interface DatabaseService {
    fun insertSyringe(syringe: Syringe): String?
    fun selectSyringeById(id: String): Syringe?
    fun deleteSyringe(id: String)
    fun updateSyringe(syringe: Syringe)
    fun selectSyringes(): List<Syringe>
    fun selectSyringes(
        from: Long,
        to: Long,
        userId: Int?,
        demolisher: Demolisher,
        gpsCoordinates: String,
        demolished: Boolean,
    ): List<Syringe>

    fun insertTeam(team: Team): Int
    fun updateTeam(team: Team)
    fun selectTeams(): List<Team>
    fun selectTeamById(id: Int): Team?
    fun selectTeamByName(name: String): Team?
    fun resolveNearestTeam(gpsCoordinates: String): Team?
    fun resolveTeamsInLocation(gpsCoordinates: String): Set<Team>
    fun getObec(gpsCoordinates: String): String
    fun getMC(gpsCoordinates: String): String
    fun getOkres(gpsCoordinates: String): String

    fun insertUser(user: User): Int
    fun updateUser(user: User)
    fun selectUserById(id: Int): User?
    fun selectUserByEmail(email: String): User?
    fun findAdmin(organization: Organization): User

    fun selectOrganizationById(id: Int): Organization?
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

    fun <T> useTransaction(func: () -> T): T
}

private const val NUMBER_OF_INSERT_SYRINGE_TRIES = 100

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
    private val syringeIdGenerator = SyringeIdGenerator()

    override fun selectSyringeById(id: String): Syringe? {
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
        userId: Int?,
        demolisher: Demolisher,
        gpsCoordinates: String,
        demolished: Boolean,
    ): List<Syringe> {

        var filter = (
                (SyringeTable.createdAt greaterEq from)
                and (SyringeTable.createdAt lessEq to)
                and (SyringeTable.demolisherType eq demolisher.name)
                and (gpsCoordinates.isBlank() or (SyringeTable.gpsCoordinates eq gpsCoordinates))
                and (SyringeTable.demolished eq demolished)
                )

        if (userId != null) {
            filter = filter and(SyringeTable.createdBy eq userId)
        }

        return databaseInstance
            .from(SyringeTable)
            .select()
            .where { filter }
            .orderBy(SyringeTable.id.asc())
            .map { row -> SyringeTable.createEntity(row) }
    }

    override fun selectUserById(id: Int): User? {
        return databaseInstance
            .from(UserTable)
            .select()
            .where { UserTable.userId eq id }
            .map { row -> UserTable.createEntity(row) }
            .firstOrNull()
    }

    override fun selectUserByEmail(email: String): User? {
        return databaseInstance
            .from(UserTable)
            .select()
            .where { UserTable.email eq email }
            .map { row -> UserTable.createEntity(row) }
            .firstOrNull()
    }

    override fun findAdmin(organization: Organization): User {
        return databaseInstance
            .from(UserTable)
            .select()
            .where { (UserTable.organizationId eq organization.id) and (UserTable.isAdmin eq true) }
            .map { row -> UserTable.createEntity(row) }
            .first()
    }

    private val mapTeamRow: (row: QueryRowSet) -> Team = { row ->
        Team(
            id = row[TeamTable.teamId]!!,
            name = row[TeamTable.name]!!,
            location = Location(
                id = row[LocationTable.id]!!,
                obec = row[LocationTable.obec]!!,
                okres = row[LocationTable.okres]!!,
                mestkaCast = row[LocationTable.mestka_cast]!!,
            ),
            organizationId = row[TeamTable.organization_id]!!
        )
    }

    override fun selectTeams(): List<Team> {
        return databaseInstance
            .from(TeamTable)
            .innerJoin(LocationTable, LocationTable.id eq TeamTable.location_id)
            .select()
            .orderBy(TeamTable.name.asc())
            .map(mapTeamRow)
    }

    override fun selectTeamById(id: Int): Team? {
        return databaseInstance
            .from(TeamTable)
            .innerJoin(LocationTable, LocationTable.id eq TeamTable.location_id)
            .select()
            .where { TeamTable.teamId eq id }
            .map(mapTeamRow)
            .firstOrNull()
    }

    override fun selectTeamByName(name: String): Team? {
        return databaseInstance
            .from(TeamTable)
            .innerJoin(LocationTable, LocationTable.id eq TeamTable.location_id)
            .select()
            .where { TeamTable.name eq name }
            .map(mapTeamRow)
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

    override fun selectOrganizationById(id: Int): Organization? {
        return databaseInstance
            .from(OrganizationTable)
            .select()
            .where { OrganizationTable.organizationId eq id }
            .map { row -> OrganizationTable.createEntity(row) }
            .firstOrNull()
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
            set(it.verified, organization.verified)
        }
    }

    override fun updateTeam(team: Team) {
        databaseInstance.update(TeamTable) {
            set(it.name, team.name)
            set(it.location_id, getLocationId(team))
            set(it.organization_id, team.organizationId)
        }
    }

    override fun insertSyringe(syringe: Syringe): String? {
        for (i in 1 .. NUMBER_OF_INSERT_SYRINGE_TRIES) {
            val id = syringeIdGenerator.generateId()
            try {
                databaseInstance.insert(SyringeTable) {
                    set(it.id, id)
                    updateSyringeRecord(this, it, syringe)
                }
                return id
            } catch (e: PSQLException) {
                if (e.sqlState != PSQLState.UNIQUE_VIOLATION.state) {
                    throw e
                }
            }
        }

        return null
    }

    override fun updateSyringe(syringe: Syringe) {
        databaseInstance.update(SyringeTable) {
            updateSyringeRecord(this, it, syringe)
        }
    }

    private fun updateSyringeRecord(builder: AssignmentsBuilder, it: SyringeTable, syringe: Syringe) {
        builder.set(it.createdAt, syringe.createdAt)
        builder.set(it.createdBy, syringe.createdBy)
        builder.set(it.reservedAt, syringe.reservedAt)
        builder.set(it.reservedBy, syringe.reservedBy)
        builder.set(it.demolishedAt, syringe.demolishedAt)
        builder.set(it.demolishedBy, syringe.demolishedBy)
        builder.set(it.demolisherType, syringe.demolisherType.name)
        builder.set(it.photo, syringe.photo)
        builder.set(it.count, syringe.count)
        builder.set(it.note, syringe.note)
        builder.set(it.gpsCoordinates, syringe.gps_coordinates)
        builder.set(it.demolished, syringe.demolished)
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
            set(it.verified, organization.verified)
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
            onConflict(it.mestka_cast, it.okres, it.obec) { doNothing() }
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

    override fun deleteSyringe(id: String) {
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

    fun selectLocation(gpsCoordinates: String): Location? {
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
            ?: run { query(LocationTable.okres eq okres) })
    }

    override fun resolveNearestTeam(gpsCoordinates: String): Team? {
        return resolveTeamsInLocation(gpsCoordinates).firstOrNull()
    }

    override fun resolveTeamsInLocation(gpsCoordinates: String): Set<Team> {
        val location = selectLocation(gpsCoordinates) ?: return setOf()

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
            .toHashSet()
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

    override fun <T> useTransaction(func: () -> T): T {
        databaseInstance.useTransaction { return func.invoke() }
    }
}
