package api

import api.SyringeTable.primaryKey
import model.Location
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

object UserTable: Table<Nothing>("users") {
    val email = varchar("email").primaryKey()
    val password = varchar("password")
    val verified = boolean("verified")
}

object LocationTable: Table<Nothing>("locations") {
    val id = int("id").primaryKey()
    val okres = varchar("okres")
    val mesto = varchar("mesto")
    val mestka_cast = varchar("mestka_cast")
}

object OrganizationTable: Table<Nothing>("organizations") {
    val name = varchar("name").primaryKey()
    val verified = boolean("verified")
}

object TeamTable: Table<Nothing>("teams") {
    val name = varchar("name").primaryKey()
    val organization_name = varchar("organization_name")
    val location_id = varchar("location_id")
}

object AdminOrganizationTable: Table<Nothing>("admin_organization") {
    val id = int("id").primaryKey()
    val admin_email = varchar("admin_email")
    val organization_name = varchar("organization_name")
}

object UserTeamTable: Table<Nothing>("user_team") {
    val id = int("id").primaryKey()
    val user_email = varchar("user_email")
    val team_name = varchar("team_name")
}