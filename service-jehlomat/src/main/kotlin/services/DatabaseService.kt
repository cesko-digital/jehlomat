package services

import api.*
import kotlinx.html.ThScope
import model.*
import model.exception.UnknownLocationException
import model.location.*
import model.pagination.OrderByDefinition
import model.pagination.PageInfo
import model.pagination.toDsl
import model.syringe.SyringeFilter
import model.syringe.OrderBySyringeColumn
import model.team.Team
import model.user.User
import model.user.UserChangeRequest
import model.user.UserInfo
import org.ktorm.database.Database
import org.ktorm.database.asIterable
import org.ktorm.dsl.*
import org.ktorm.expression.SqlFormatter
import org.ktorm.schema.ColumnDeclaring
import org.ktorm.schema.Table
import org.ktorm.support.postgresql.PostgreSqlFormatter
import org.ktorm.support.postgresql.insertOrUpdateReturning
import org.postgresql.util.PSQLException
import org.postgresql.util.PSQLState
import utils.hashPassword
import kotlin.RuntimeException
import kotlin.streams.toList


private const val NUMBER_OF_INSERT_SYRINGE_TRIES = 100

class DatabaseService(
    host: String = System.getenv("DATABASE_HOST"),
    port: String = System.getenv("DATABASE_PORT"),
    database: String = System.getenv("DATABASE_NAME"),
    user: String = System.getenv("DATABASE_USERNAME"),
    password: String = System.getenv("PGPASSWORD") ?: ""
) {
    private val databaseInstance = Database.connect(
        "jdbc:postgresql://$host:$port/$database", user = user, password = password
    )

    private val syringeCreatedByAlias = UserTable.aliased("uCreatedBy")
    private val syringeReservedByAlias = UserTable.aliased("uReservedBy")
    private val syringeDemolishedByAlias = UserTable.aliased("uDemolishedBy")
    private val teamTableAlias = TeamTable.aliased("teamAlias")

    private val syringeSelectColumns: MutableList<ColumnDeclaring<*>> = mutableListOf()

    init {
        syringeSelectColumns.addAll(SyringeTable.columns)
        syringeSelectColumns.addAll(LocationTable.columns)
        syringeSelectColumns.addAll(syringeCreatedByAlias.columns)
        syringeSelectColumns.addAll(syringeReservedByAlias.columns)
        syringeSelectColumns.addAll(syringeDemolishedByAlias.columns)
    }

    private val mapSyringeRow: (row: QueryRowSet) -> Syringe = { row ->
        Syringe(
            id = row[SyringeTable.id]!!,
            createdAt = row[SyringeTable.createdAt]!!,
            createdBy = mapUserInfoRow(row, syringeCreatedByAlias),
            reservedTill = row[SyringeTable.reservedTill],
            reservedBy = mapUserInfoRow(row, syringeReservedByAlias),
            demolishedAt = row[SyringeTable.demolishedAt],
            demolishedBy = mapUserInfoRow(row, syringeDemolishedByAlias),
            photo = row[SyringeTable.photo]!!,
            count = row[SyringeTable.count]!!,
            note = row[SyringeTable.note] ?: "",
            demolisherType = Demolisher.valueOf(row[SyringeTable.demolisherType]!!),
            gps_coordinates = row[SyringeTable.gpsCoordinates]!!,
            demolished = row[SyringeTable.demolished]!!,
            location = mapLocationRow(row),
        )
    }

    private val mapUserInfoRow: (row: QueryRowSet, table: UserTable) -> UserInfo? = { row, table ->
        if (row[table.userId] != null) {
            UserInfo(
                id = row[table.userId]!!,
                username = row[table.username]!!,
                organizationId = row[table.organizationId]!!,
                teamId = row[table.teamId],
                isAdmin = row[table.isAdmin]!!
            )
        } else {
            null
        }
    }

    private val mapUserRow: (row: QueryRowSet) -> User = { row ->
       User(
            id = row[UserTable.userId]!!,
            email = row[UserTable.email]!!,
            username = row[UserTable.username]!!,
            password = row[UserTable.password]!!,
            verified = row[UserTable.verified]!!,
            verificationCode = row[UserTable.verificationCode]!!,
            passResetUrlCode = row[UserTable.passResetUrlCode]!!,
            organizationId = row[UserTable.organizationId]!!,
            teamId = row[UserTable.teamId],
            isAdmin = row[UserTable.isAdmin]!!
        )
    }

    private val syringeSelectCommonQuery = databaseInstance
        .from(SyringeTable)
        .innerJoin(LocationTable, LocationTable.id eq SyringeTable.locationId)
        .leftJoin(syringeCreatedByAlias, syringeCreatedByAlias.userId eq SyringeTable.createdBy)
        .leftJoin(syringeReservedByAlias, syringeReservedByAlias.userId eq SyringeTable.reservedBy)
        .leftJoin(syringeDemolishedByAlias, syringeDemolishedByAlias.userId eq SyringeTable.demolishedBy)
        .select(syringeSelectColumns)

    fun selectSyringeById(id: String): Syringe? {
        return syringeSelectCommonQuery
            .where { SyringeTable.id eq id }
            .map(mapSyringeRow)
            .firstOrNull()
    }

    fun selectSyringes(): List<Syringe> {
        return syringeSelectCommonQuery
            .orderBy(SyringeTable.id.asc())
            .map(mapSyringeRow)
    }

    fun selectSyringes(filter: SyringeFilter, pageInfo: PageInfo, orderByList: List<OrderByDefinition<OrderBySyringeColumn>>): List<Syringe> {
        val filterDsl = SyringeFilterTransformer.filterToDsl(filter, syringeCreatedByAlias)

        return syringeSelectCommonQuery
            .where { filterDsl }
            .limit(pageInfo.index, pageInfo.size + 1)
            .orderBy(orderByList.stream().map{
                it.toDsl(mapOf(Pair(OrderBySyringeColumn.CREATED_BY, syringeCreatedByAlias)))
            }.toList())
            .map(mapSyringeRow)
    }

    fun selectSyringes(filter: SyringeFilter, organizationId: Int?): List<CSVExportSchema> {
        val filterDsl = SyringeFilterTransformer.filterToDsl(filter, syringeCreatedByAlias, organizationId)

        val selectColumns: MutableList<ColumnDeclaring<*>> = mutableListOf()
        selectColumns.addAll(SyringeTable.columns)
        selectColumns.addAll(LocationTable.columns)
        selectColumns.addAll(syringeCreatedByAlias.columns)
        selectColumns.addAll(syringeDemolishedByAlias.columns)
        selectColumns.addAll(OrganizationTable.columns)
        selectColumns.addAll(teamTableAlias.columns)

        return databaseInstance.from(SyringeTable)
            .innerJoin(LocationTable, LocationTable.id eq SyringeTable.locationId)
            .leftJoin(syringeCreatedByAlias, syringeCreatedByAlias.userId eq SyringeTable.createdBy)
            .leftJoin(syringeDemolishedByAlias, syringeDemolishedByAlias.userId eq SyringeTable.demolishedBy)
            .leftJoin(OrganizationTable, syringeCreatedByAlias.organizationId eq OrganizationTable.organizationId)
            .leftJoin(teamTableAlias, teamTableAlias.teamId eq syringeCreatedByAlias.teamId)
            .select(selectColumns)
            .where { filterDsl }
            .orderBy(SyringeTable.id.asc())
            .map { row ->
                CSVExportSchema(
                    id = row[SyringeTable.id]!!,
                    createdTimestamp = row[SyringeTable.createdAt]!!,
                    createdByEmail = row[syringeCreatedByAlias.email]!!,
                    createdByUsername = row[syringeCreatedByAlias.username]!!,
                    destroyedByEmail = row[syringeDemolishedByAlias.email],
                    destroyedByUsername = row[syringeDemolishedByAlias.username],
                    destroyedTimestamp = row[SyringeTable.demolishedAt],
                    demolishingType = Demolisher.valueOf(row[SyringeTable.demolisherType]!!).czechName(),
                    count = row[SyringeTable.count],
                    gpsCoordinates = row[SyringeTable.gpsCoordinates],
                    okres = row[LocationTable.okres_name]!!,
                    mc = row[LocationTable.mestka_cast_name]!!,
                    obec = row[LocationTable.obec_name]!!,
                    destroyed = if(row[SyringeTable.demolished]!!) "ANO" else "NE",
                    teamName = row[teamTableAlias.name],
                    organizationName =row[OrganizationTable.name]!!
                )
            }
    }

    fun selectUserById(id: Int): User? {
        return databaseInstance
            .from(UserTable)
            .select()
            .where { UserTable.userId eq id }
            .map(mapUserRow)
            .firstOrNull()
    }

    fun selectUserByEmail(email: String): User? {
        return databaseInstance
            .from(UserTable)
            .select()
            .where { UserTable.email eq email }
            .map(mapUserRow)
            .firstOrNull()
    }

    fun selectUserByUsername(username: String): User? {
        return databaseInstance
            .from(UserTable)
            .select()
            .where { UserTable.username eq username }
            .map(mapUserRow)
            .firstOrNull()
    }

    fun selectUsersByOrganization(organizationId: Int): List<User> {
        return databaseInstance
            .from(UserTable)
            .select()
            .where { (UserTable.organizationId eq organizationId) and (UserTable.verified eq true) }
            .orderBy(UserTable.username.asc())
            .map(mapUserRow)
            .toList()
    }

    fun findAdmin(organization: Organization): User {
        return databaseInstance
            .from(UserTable)
            .select()
            .where { (UserTable.organizationId eq organization.id) and (UserTable.isAdmin eq true) }
            .map(mapUserRow)
            .first()
    }

    private val mapLocationRow: (row: QueryRowSet) -> Location = { row ->
        Location(
            id = row[LocationTable.id]!!,
            okres = row[LocationTable.okres]!!,
            okresName = row[LocationTable.okres_name]!!,
            obec = wrapFakeNull(row[LocationTable.obec]),
            obecName = wrapFakeNull(row[LocationTable.obec_name]),
            mestkaCast = wrapFakeNull(row[LocationTable.mestka_cast]),
            mestkaCastName = wrapFakeNull(row[LocationTable.mestka_cast_name]),
        )
    }

    private val mapTeamRow: (row: QueryRowSet) -> Team = { row ->
        Team(
            id = row[TeamTable.teamId]!!,
            name = row[TeamTable.name]!!,
            organizationId = row[TeamTable.organization_id]!!,
            locations = listOf(mapLocationRow(row))
        )
    }

    private fun wrapFakeNull(value: Int?): Int? {
        return if (value != Int.MIN_VALUE) {
            value
        } else {
            null
        }
    }

    private fun wrapFakeNull(value: String?): String? {
        return value?.ifEmpty {
            null
        }
    }

    fun selectTeams(): List<Team> {
        return selectTeamsByCondition { TeamTable.teamId notEq 0 }
    }

    fun selectTeamById(id: Int): Team? {
        return selectTeamsByCondition { TeamTable.teamId eq id }.firstOrNull()
    }

    fun selectTeamByName(name: String): Team? {
        return selectTeamsByCondition { TeamTable.name eq name }.firstOrNull()
    }


    fun selectTeamsByOrganizationId(organizationId: Int): List<Team> {
        return selectTeamsByCondition { TeamTable.organization_id eq organizationId }.sortedBy { team -> team.name }
    }

    private fun selectTeamsByCondition(condition: () -> ColumnDeclaring<Boolean>): List<Team> {
        return databaseInstance
            .from(TeamTable)
            .innerJoin(TeamLocationTable, TeamLocationTable.teamId eq TeamTable.teamId)
            .innerJoin(LocationTable, LocationTable.id eq TeamLocationTable.locationId)
            .select()
            .where(condition)
            .map(mapTeamRow)
            .groupBy { it.id }
            .values
            .map {
                Team (
                    id = it.first().id,
                    name = it.first().name,
                    organizationId = it.first().organizationId,
                    locations = it.fold(mutableListOf()) { acc, el -> acc.addAll(el.locations); acc }
                )
            }
            .toList()
    }

    fun selectOrganizations(): List<Organization> {
        return databaseInstance
            .from(OrganizationTable)
            .select()
            .orderBy(OrganizationTable.name.asc())
            .map { row -> OrganizationTable.createEntity(row) }
    }

    fun updateUser(user: User) {
        databaseInstance.update(UserTable) {
            updateUserRecord(this, it, user)
            where {
                it.userId eq user.id
            }
        }
    }

    fun updateUserAttributes(id: Int, attributes: UserChangeRequest) {
        databaseInstance.update(UserTable) {
            set(it.username, attributes.username)
            set(it.email, attributes.email)
            set(it.teamId, attributes.teamId)
            where {
                it.userId eq id
            }
        }
    }

    fun updateUserPassword(id: Int, password: String) {
        databaseInstance.update(UserTable) {
            set(it.password, password.hashPassword())
            where {
                it.userId eq id
            }
        }
    }

    private fun updateUserRecord(builder: AssignmentsBuilder, it: UserTable, user: User) {
        builder.set(it.email, user.email)
        builder.set(it.password, user.password.hashPassword())
        builder.set(it.username, user.username)
        builder.set(it.verified, user.verified)
        builder.set(it.verificationCode, user.verificationCode)
        builder.set(it.passResetUrlCode, user.passResetUrlCode)
        builder.set(it.organizationId, user.organizationId)
        builder.set(it.teamId, user.teamId)
        builder.set(it.isAdmin, user.isAdmin)
    }

    fun selectOrganizationById(id: Int): Organization? {
        return databaseInstance
            .from(OrganizationTable)
            .select()
            .where { OrganizationTable.organizationId eq id }
            .map { row -> OrganizationTable.createEntity(row) }
            .firstOrNull()
    }

    fun selectOrganizationByName(name: String): Organization? {
        return databaseInstance
            .from(OrganizationTable)
            .select()
            .where { OrganizationTable.name eq name }
            .map { row -> OrganizationTable.createEntity(row) }
            .firstOrNull()
    }

    fun updateOrganization(organization: Organization) {
        databaseInstance.update(OrganizationTable) {
            set(it.name, organization.name)
            set(it.verified, organization.verified)
            where {
                it.organizationId eq organization.id
            }
        }
    }

    fun updateTeam(team: Team) {
        useTransaction {
            databaseInstance.update(TeamTable) {
                set(it.name, team.name)
                set(it.organization_id, team.organizationId)
                where {
                    it.teamId eq team.id
                }
            }
            databaseInstance.delete(TeamLocationTable) { it.teamId eq team.id }
            insertTeamLocations(team.id, team.locations)
        }
    }

    fun insertSyringe(syringe: Syringe): String? {
        for (i in 1 .. NUMBER_OF_INSERT_SYRINGE_TRIES) {
            val id = RandomIdGenerator.generateSyringeId()
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

    fun updateSyringe(syringe: Syringe) {
        databaseInstance.update(SyringeTable) {
            updateSyringeRecord(this, it, syringe)
            where {
                it.id eq syringe.id
            }
        }
    }

    private fun updateSyringeRecord(builder: AssignmentsBuilder, it: SyringeTable, syringe: Syringe) {
        builder.set(it.createdAt, syringe.createdAt)
        builder.set(it.createdBy, syringe.createdBy?.id)
        builder.set(it.reservedTill, syringe.reservedTill)
        builder.set(it.reservedBy, syringe.reservedBy?.id)
        builder.set(it.demolishedAt, syringe.demolishedAt)
        builder.set(it.demolishedBy, syringe.demolishedBy?.id)
        builder.set(it.demolisherType, syringe.demolisherType.name)
        builder.set(it.photo, syringe.photo)
        builder.set(it.count, syringe.count)
        builder.set(it.note, syringe.note)
        builder.set(it.gpsCoordinates, syringe.gps_coordinates)
        builder.set(it.demolished, syringe.demolished)
        builder.set(it.locationId, syringe.location.id)
    }


    fun insertUser(user: User): Int {
        return databaseInstance.insertAndGenerateKey(UserTable) {
            updateUserRecord(this, it, user)
        } as Int
    }

    fun insertOrganization(organization: Organization): Int {
        return databaseInstance.insertAndGenerateKey(OrganizationTable) {
            set(it.name, organization.name)
            set(it.verified, organization.verified)
        } as Int
    }

    fun deleteOrganization(organization: Organization) {
        databaseInstance.delete(OrganizationTable) { it.name eq organization.name }
    }

    fun insertTeam(team: Team): Int {
        var teamId = 0

        useTransaction {
            teamId = databaseInstance.insertAndGenerateKey(TeamTable) {
                set(it.organization_id, team.organizationId)
                set(it.name, team.name)
            } as Int
            insertTeamLocations(teamId, team.locations)
        }

        return teamId
    }

    private fun insertTeamLocations(teamId: Int, locations: List<Location>) {
        for (loc in locations) {
            databaseInstance.insert(TeamLocationTable) {
                set(it.teamId, teamId)
                set(it.locationId, getLocationId(loc))
            }
        }
    }

    private fun getLocationId(location: Location): Int {
        return if (location.id > 0) {
            location.id
        } else {
            insertLocation(location).id
        }
    }

    fun deleteSyringe(id: String) {
        databaseInstance.delete(SyringeTable) { it.id eq id }
    }

    fun deleteTeam(name: String) {
        databaseInstance.delete(TeamTable) { it.name eq name }
    }

    private fun postgisLocation(table: String, gpsCoordinates: String, idColumn: String, nameColumn: String): LocationPart? {
        return databaseInstance.useConnection { conn ->
            val sql =
                "SELECT $idColumn, $nameColumn FROM $table WHERE ST_Within('POINT( $gpsCoordinates )'::geometry, $table.wkb_geometry)"

            conn.prepareStatement(sql).use { statement ->
                statement.executeQuery().asIterable().map { LocationPart(
                    it.getString(1), it.getString(2)
                ) }
            }
        }.firstOrNull()
    }

    fun getObec(gpsCoordinates: String): LocationPart? {
        return postgisLocation("sph_obec", gpsCoordinates, "kod_lau2", "nazev_lau2")
    }

    fun getMC(gpsCoordinates: String): LocationPart? {
        return postgisLocation("sph_mc", gpsCoordinates, "kod_mc", "nazev_mc")
    }

    fun getOkres(gpsCoordinates: String): LocationPart? {
        return postgisLocation("sph_okres", gpsCoordinates, "kod_lau1", "nazev_lau1")
    }

    fun getLocations(): List<Map<String, String>> {
        val okres = getLocations("kod_lau1", "nazev_lau1", "sph_okres", "OKRES")
        val obce = getLocations("kod_lau2", "nazev_lau2", "sph_obec", "OBEC")
        val mc = getLocations("kod_mc", "nazev_mc", "sph_mc", "MC")
        return okres + obce + mc
    }

    private fun getLocations(idColumn: String, nameColumn: String, table: String, type: String): List<Map<String, String>> {
        return databaseInstance.useConnection { conn ->
            val sql = "SELECT $idColumn, $nameColumn FROM $table"
            conn.prepareStatement(sql).use { statement ->
                statement.executeQuery().asIterable().map {
                    mapOf(
                        "id" to it.getString(1),
                        "name" to it.getString(2),
                        "type" to type
                    )
                }
            }
        }
    }

    fun getLocationCombinations(gpsCoordinates: String): List<Location> {
        val okres = getOkres(gpsCoordinates)
        val obec = getObec(gpsCoordinates)
        val mc = getMC(gpsCoordinates)

        val locations = mutableListOf<Location>()

        if (okres != null) {
            locations.add(Location(0, okres.id, okres.name, null, null, null, null))
            if (obec != null) {
                locations.add(Location(0, okres.id, okres.name, obec.id.toInt(), obec.name, null, null))
                if (mc != null) {
                    locations.add(Location(0, okres.id, okres.name, obec.id.toInt(), obec.name, mc.id.toInt(), mc.name))
                }
            }
        }

        return locations
    }

    /**
     * @throws NumberFormatException id parameter is not parsable to integer
     */
    fun getLocationGeom(id: String, table: Table<Nothing>): String? {
        val idColumn = when (table) {
            OkresTable ->  OkresTable.kod_lau1.name
            ObecTable -> ObecTable.kod_lau2.name
            MCTable -> MCTable.kod_mc.name
            else -> throw RuntimeException("Unsupported table ${table.tableName} for the geolocation")
        }

        return databaseInstance.useConnection { conn ->
            val sql =
                conn.prepareStatement("SELECT ST_AsGeoJSON(ST_GeomFromWKB(wkb_geometry)) FROM ${table.tableName} where $idColumn = ?")
            when (table) {
                OkresTable -> sql.setString(1, id)
                ObecTable -> sql.setInt(1, id.toInt())
                MCTable -> sql.setInt(1, id.toInt())
                else -> throw RuntimeException("Unsupported table ${table.tableName} for the geolocation")
            }
            return sql.executeQuery().asIterable().map { it.getString(1) }.firstOrNull()
        }
    }

    private fun insertLocation(location:Location): Location {
        val id = databaseInstance.insertOrUpdateReturning(LocationTable, LocationTable.id) {
            set(it.okres, location.okres)
            set(it.okres_name, location.okresName)
            set(it.obec, location.obec?: Int.MIN_VALUE)
            set(it.obec_name, location.obecName?: "")
            set(it.mestka_cast, location.mestkaCast?: Int.MIN_VALUE)
            set(it.mestka_cast_name, location.mestkaCastName?: "")
            onConflict(it.okres, it.obec, it.mestka_cast) { doNothing() }
        }

        return if (id != null) {
            selectLocationInner(LocationTable.id eq id)!!
        } else {
            selectLocation(location.okres, location.obec, location.mestkaCast)!!
        }
    }

    private fun selectLocation(gpsCoordinates: String): Location? {
        val town = getObec(gpsCoordinates)
        val locality = getMC(gpsCoordinates)
        val district = getOkres(gpsCoordinates)

        return selectLocation(district?.id, town?.id?.toInt(), locality?.id?.toInt())
    }

    private fun selectLocation(okres: String?, obec: Int?, mc: Int?): Location? {
        if (okres == null) {
            return null
        }

        var filter = (LocationTable.okres eq okres)

        if (obec != null) {
            filter = filter and (LocationTable.obec eq obec)
        } else {
            filter = filter and (LocationTable.obec eq Int.MIN_VALUE)
        }

        if (mc != null) {
            filter = filter and (LocationTable.mestka_cast eq mc)
        } else {
            filter = filter and (LocationTable.mestka_cast eq Int.MIN_VALUE)
        }

        return selectLocationInner(filter)
    }

    private fun selectLocationInner(condition: ColumnDeclaring<Boolean>): Location? {
        return databaseInstance.from(LocationTable)
            .select()
            .where { condition }
            .map { row -> mapLocationRow(row) }
            .firstOrNull()
    }

    fun selectOrInsertLocation(gpsCoordinates: String): Location {
        val okres = getOkres(gpsCoordinates) ?: throw UnknownLocationException("GPS coordinates not found.")
        val obec = getObec(gpsCoordinates)
        val mc = getMC(gpsCoordinates)

        return selectLocation(okres.id, obec?.id?.toInt(), mc?.id?.toInt())
            ?: insertLocation(Location(
                0,
                okres.id,
                okres.name,
                obec?.id?.toInt(),
                obec?.name,
                mc?.id?.toInt(),
                mc?.name
            ))
    }

    fun resolveLocationIds(ids: List<LocationId>): List<Location> {
        return ids.map { id -> resolveLocationId(id) }.toList()
    }

    private fun resolveLocationId(locationId: LocationId): Location {
        val ruianIdTriplet = when (locationId.type) {
            LocationType.OKRES -> resolveRuianOkres(locationId.id)
            LocationType.OBEC -> resolveRuianObec(locationId.id.toInt())
            LocationType.MC -> resolveRuianMC(locationId.id.toInt())
        }

        return selectLocation(ruianIdTriplet.okres, ruianIdTriplet.obec, ruianIdTriplet.mc)
            ?: resolveRuianNames(ruianIdTriplet)
    }

    private fun resolveRuianNames(ruianIdTriplet: RuianIdTriplet): Location {
        return Location(
            0,
            ruianIdTriplet.okres,
            selectRuianName(LocationType.OKRES, ruianIdTriplet.okres)!!,
            ruianIdTriplet.obec,
            selectRuianName(LocationType.OBEC, ruianIdTriplet.obec),
            ruianIdTriplet.mc,
            selectRuianName(LocationType.MC, ruianIdTriplet.mc)
        )
    }

    private fun resolveRuianOkres(id: String): RuianIdTriplet {
        return RuianIdTriplet(id, null, null)
    }

    private fun resolveRuianObec(id: Int): RuianIdTriplet {
        return databaseInstance.from(ObecTable)
            .select(ObecTable.kod_lau1)
            .where { ObecTable.kod_lau2 eq id }
            .map { row -> RuianIdTriplet(
                row.getString(1)!!,
                id,
                null
                )}
            .firstOrNull() ?: throw UnknownLocationException("Unknown RUIAN location OBEC:${id}.")
    }

    private fun resolveRuianMC(id: Int): RuianIdTriplet {
        return databaseInstance.from(MCTable)
            .select(MCTable.kod_lau1, MCTable.kod_lau2)
            .where { MCTable.kod_mc eq id }
            .map { row -> RuianIdTriplet(
                row.getString(1)!!,
                row.getInt(2),
                id
            )}
            .firstOrNull() ?: throw UnknownLocationException("Unknown RUIAN location MC:${id}.")
    }

    private fun selectRuianName(type: LocationType, id: Any?): String? {
        if (id == null) {
            return null
        }

        val dbTriple = when (type) {
            LocationType.OKRES ->  Triple(OkresTable, OkresTable.nazev_lau1, (OkresTable.kod_lau1 eq id.toString()))
            LocationType.OBEC -> Triple(ObecTable, ObecTable.nazev_lau2, (ObecTable.kod_lau2 eq id.toString().toInt()))
            LocationType.MC -> Triple(MCTable, MCTable.nazev_mc, (MCTable.kod_mc eq id.toString().toInt()))
        }

        return databaseInstance
            .from(dbTriple.first)
            .select(dbTriple.second)
            .where(dbTriple.third)
            .map { row -> row.getString(1)}
            .firstOrNull()
    }

    fun resolveNearestTeam(gpsCoordinates: String): Team? {
        return resolveTeamsInLocation(gpsCoordinates).firstOrNull()
    }

    fun resolveTeamsInLocation(gpsCoordinates: String): Set<Team> {
        val location = selectLocation(gpsCoordinates) ?: return setOf()

        val teamIds = databaseInstance
            .from(TeamLocationTable)
            .select(TeamLocationTable.teamId)
            .where { TeamLocationTable.locationId eq location.id }
            .map { row -> row.getInt(1) }
            .toHashSet()

        if (teamIds.isNotEmpty()) {
            return selectTeamsByCondition { TeamTable.teamId inList teamIds }.toHashSet()
        } else {
            return emptySet()
        }
    }

    fun cleanLocation(): Int {
        return databaseInstance.deleteAll(LocationTable)
    }

    fun cleanTeams(): Int {
        databaseInstance.deleteAll(TeamLocationTable)
        return databaseInstance.deleteAll(TeamTable)
    }

    fun cleanUsers(): Int {
        return databaseInstance.deleteAll(UserTable)
    }

    fun cleanOrganizations(): Int {
        return databaseInstance.deleteAll(OrganizationTable)
    }

    fun cleanSyringes(): Int {
        return databaseInstance.deleteAll(SyringeTable)
    }

    fun <T> useTransaction(func: () -> T): T {
        databaseInstance.useTransaction { return func.invoke() }
    }

    fun <T> useConnection(func: (java.sql.Connection) -> T): T {
        databaseInstance.useConnection { return func.invoke(it) }
    }

    fun createSqlFormatter(): SqlFormatter {
        return  PostgreSqlFormatter(databaseInstance, false, 0)
    }
}
