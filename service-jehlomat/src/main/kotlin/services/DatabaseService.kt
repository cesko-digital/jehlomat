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
    fun insertSyringe(syringe: Syringe)
    fun insertUser(user: User)
    fun insertTeam(team: Team)
    fun selectUserByEmail(email: String): User?
    fun getObec(gpsCoordinates: String): String
    fun getMC(gpsCoordinates: String): String
    fun getOkres(gpsCoordinates: String): String
    fun resolveNearestTeam(gpsCoordinates: String): Team
    fun updateUser(user: User)

    fun selectOrganizationByName(name: String): Organization?
    fun selectOrganizations(): List<Organization>
    fun updateOrganization(organization: Organization)
    fun insertOrganization(organization: Organization)
    fun deleteOrganization(organization: Organization)

    fun cleanLocation(): Int
    fun cleanTeams(): Int
    fun cleanUsers(): Int
    fun cleanOrganizations(): Int
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

    override fun selectUserByEmail(email: String): User? {
        return databaseInstance
            .from(UserTable)
            .select()
            .where { UserTable.email eq email }
            .map { row -> UserTable.createEntity(row) }
            .firstOrNull()
    }

    fun selectTeams(): List<Team> {
        return databaseInstance
            .from(TeamTable)
            .select()
            .orderBy(TeamTable.name.asc())
            .map { row -> TeamTable.createEntity(row) }
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
            set(it.teamName, user.teamName)
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
            set(it.email, organization.email)
            set(it.password, organization.password.hashPassword())
            set(it.verified, organization.verified)
        }
    }

    fun updateTeam(team: Team) {
        databaseInstance.update(TeamTable) {
            set(it.name, team.name)
            set(it.location_id, team.location.id)
            set(it.organization_name, team.organizationName)
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
            set(it.password, user.password.hashPassword())
            set(it.verified, user.verified)
            set(it.teamName, user.teamName)
        }
    }

    override fun insertOrganization(organization: Organization) {
        databaseInstance.insert(OrganizationTable) {
            set(it.name, organization.name)
            set(it.email, organization.email)
            set(it.password, organization.password.hashPassword())
            set(it.verified, organization.verified)
        }
    }

    override fun deleteOrganization(organization: Organization) {
        databaseInstance.delete(OrganizationTable) { it.name eq organization.name }
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
            set(it.organization_name, team.organizationName)
            set(it.location_id, locationId)
            set(it.name, team.name)
            onConflict { doNothing() }
        }
    }

    fun deleteSyringe(id: Int) {
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
            .map { row ->
                Team(
                    name=row.getString("name")!!,
                    location=location,
                    organizationName=row.getString("organization_name")!!,
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
}
