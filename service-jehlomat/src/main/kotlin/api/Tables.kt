package api

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
    val gps_coordinates = varchar("gps_coordinates")
}

object UserTable: Table<Nothing>("users") {
    val email = text("email").primaryKey()
    val password = text("password")
    val verified = boolean("verified")
}