package api

import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.long
import org.ktorm.schema.varchar

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