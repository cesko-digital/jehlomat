package api

import model.*
import org.ktorm.dsl.QueryRowSet
import org.ktorm.schema.*

object DemolisherTable: Table<Nothing>("demolisher") {
    val type = varchar("type").primaryKey()
}


object SyringeTable: Table<Nothing>("syringes") {
    val id = varchar("id").primaryKey()
    val createdAt = long("created_at")
    val createdBy = int("created_by")
    val reservedTill = long("reserved_till")
    val reservedBy = int("reserved_by")
    val demolishedAt = long("demolished_at")
    val demolishedBy = int("demolished_by")
    val photo = varchar("photo")
    val count = int("count_")
    val note = varchar("note")
    val demolisherType = varchar("demolisher_type")
    val gpsCoordinates = varchar("gps_coordinates")
    val locationId = int("location_id")
    val demolished = boolean("demolished")
}

open class UserTable(alias: String?) : Table<Nothing>("users", alias) {
    companion object : UserTable(null)
    override fun aliased(alias: String) = UserTable(alias)

    val userId = int("user_id").primaryKey();
    val email = varchar("email")
    val password = varchar("password")
    val verified = boolean("verified")
    val organizationId = int("organization_id")
    val teamId = int("team_id")
    val isAdmin = boolean("is_admin")
}

object LocationTable: Table<Nothing>("locations") {
    val id = int("location_id").primaryKey()
    val okres = varchar("okres")
    val obec = varchar("obec")
    val mestka_cast = varchar("mestka_cast")
}

object OrganizationTable: BaseTable<Organization>("organizations") {
    val organizationId = int("organization_id").primaryKey()
    val name = varchar("name")
    val verified = boolean("verified")

    override fun doCreateEntity(row: QueryRowSet, withReferences: Boolean) = Organization(
        id = row[organizationId]!!,
        name = row[name]!!,
        verified = row[verified]!!
    )
}

object TeamTable: Table<Nothing>("teams") {
    val teamId = int("team_id").primaryKey()
    val name = varchar("name")
    val organization_id = int("organization_id")
    val location_id = int("location_id")
}
