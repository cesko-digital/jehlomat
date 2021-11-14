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
    val email = varchar("email")
    val photo = varchar("photo")
    val count = int("count_")
    val note = varchar("note")
    val demolisherType = varchar("demolisher_type")
    val gpsCoordinates = varchar("gps_coordinates")
    val demolished = boolean("demolished")

    override fun doCreateEntity(row: QueryRowSet, withReferences: Boolean) = Syringe(
        id = row[id]!!,
        timestamp = row[timestamp]!!,
        email = row[email]!!,
        photo = row[photo]!!,
        count = row[count]!!,
        note = row[note] ?: "",
        demolisher = Demolisher.valueOf(row[demolisherType]!!),
        gps_coordinates = row[gpsCoordinates]!!,
        demolished = row[demolished]!!,
    )
}

object UserTable: BaseTable<User>("users") {
    val email = varchar("email").primaryKey()
    val password = varchar("password")
    val verified = boolean("verified")
    val teamName = varchar("team_name")

    override fun doCreateEntity(row: QueryRowSet, withReferences: Boolean) = User(
        email = row[email] ?: "",
        password = row[password] ?: "",
        verified = row[verified] ?: false,
        teamName = row[teamName] ?: ""
    )
}

object LocationTable: Table<Nothing>("locations") {
    val id = int("id").primaryKey()
    val okres = varchar("okres")
    val obec = varchar("obec")
    val mestka_cast = varchar("mestka_cast")
}

object OrganizationTable: BaseTable<Organization>("organizations") {
    val name = varchar("name").primaryKey()
    val email = varchar("email")
    val password = varchar("password")
    val verified = boolean("verified")

    override fun doCreateEntity(row: QueryRowSet, withReferences: Boolean) = Organization(
        name = row[name]!!,
        email = row[email]!!,
        password = row[password]!!,
        verified = row[verified]!!
    )
}

object TeamTable: Table<Nothing>("teams") {
    val name = varchar("name").primaryKey()
    val organization_name = varchar("organization_name")
    val location_id = int("location_id")
}
