package api

import model.Demolisher
import model.Organization
import model.Syringe
import model.User
import org.ktorm.dsl.QueryRowSet
import org.ktorm.schema.*

object DemolisherTable: Table<Nothing>("demolisher") {
    val type = varchar("type").primaryKey()
}


object SyringeTable: BaseTable<Syringe>("syringes") {
    val id = int("id").primaryKey()
    val timestamp = long("timestamp_")
    val teamId = int("team_id")
    val photo = varchar("photo")
    val count = int("count_")
    val note = varchar("note")
    val demolisherType = varchar("demolisher_type")
    val gpsCoordinates = varchar("gps_coordinates")
    val demolished = boolean("demolished")

    override fun doCreateEntity(row: QueryRowSet, withReferences: Boolean) = Syringe(
        id = row[id]!!,
        timestamp = row[timestamp]!!,
        teamId = row[teamId]!!,
        photo = row[photo]!!,
        count = row[count]!!,
        note = row[note] ?: "",
        demolisher = Demolisher.valueOf(row[demolisherType]!!),
        gps_coordinates = row[gpsCoordinates]!!,
        demolished = row[demolished]!!,
    )
}

object UserTable: BaseTable<User>("users") {
    val userId = int("user_id").primaryKey();
    val email = varchar("email")
    val password = varchar("password")
    val verified = boolean("verified")
    val organizationId = int("organization_id")
    val teamId = int("team_id")
    val isAdmin = boolean("is_admin")

    override fun doCreateEntity(row: QueryRowSet, withReferences: Boolean) = User(
        id = row[userId]!!,
        email = row[email]!!,
        password = row[password]!!,
        verified = row[verified]!!,
        organizationId = row[organizationId]!!,
        teamId = row[teamId],
        isAdmin = row[isAdmin]!!
    )
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

    override fun doCreateEntity(row: QueryRowSet, withReferences: Boolean) = Organization(
        id = row[organizationId]!!,
        name = row[name]!!
    )
}

object TeamTable: Table<Nothing>("teams") {
    val teamId = int("team_id").primaryKey()
    val name = varchar("name")
    val organization_id = int("organization_id")
    val location_id = int("location_id")
}
