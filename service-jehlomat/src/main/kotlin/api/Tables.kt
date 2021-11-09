package api

import model.Organization
import model.User
import org.ktorm.dsl.QueryRowSet
import org.ktorm.schema.*

object DemolisherTable: Table<Nothing>("demolisher") {
    val type = varchar("type").primaryKey()
}


object SyringeTable: Table<Nothing>("syringes") {
    val id = int("id").primaryKey()
    val timestamp = long("timestamp")
    val email = varchar("email")
    val photo = varchar("photo")
    val count = int("count")
    val note = varchar("note")
    val demolisherType = varchar("demolisher_type")
    val gpsCoordinates = varchar("gps_coordinates")
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
