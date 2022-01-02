package api

import api.MCTable.primaryKey
import api.ObecTable.primaryKey
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

    val userId = int("user_id").primaryKey()
    val email = varchar("email")
    val username = varchar("username")
    val password = varchar("password")
    val verified = boolean("verified")
    val verificationCode = varchar("verification_code")
    val organizationId = int("organization_id")
    val teamId = int("team_id")
    val isAdmin = boolean("is_admin")
}

object LocationTable: Table<Nothing>("locations") {
    val id = int("location_id").primaryKey()
    val okres = varchar("okres")
    val obec = int("obec")
    val mestka_cast = int("mestka_cast")
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

open class TeamTable(alias: String?) : Table<Nothing>("teams", alias) {
    companion object : TeamTable(null)
    override fun aliased(alias: String) = TeamTable(alias)

    val teamId = int("team_id").primaryKey()
    val name = varchar("name")
    val organization_id = int("organization_id")
    val location_id = int("location_id")
}


object MCTable: Table<Nothing>("sph_mc") {
    val ogc_fid = int("ogc_fid").primaryKey()
    val id = float("id")
    val kod_lau1 = varchar("kod_lau1")
    val kod_lau2 = int("kod_lau2")
    val kod_mc = int("kod_mc")
    val nazev_mc = varchar("nazev_mc")
    val kod_so = int("kod_so")
    val wkb_geometry = bytes("wkb_geometry")
}

object ObecTable: Table<Nothing>("sph_obec") {
    val ogc_fid = int("ogc_fid").primaryKey()
    val id = float("id")
    val kod_lau1 = varchar("kod_lau1")
    val kod_lau2 = int("kod_lau2")
    val kod_orp = int("kod_orp")
    val kod_opu = int("kod_opu")
    val nazev_lau2 = varchar("nazev_lau2")
    val wkb_geometry = bytes("wkb_geometry")
}

object OkresTable: Table<Nothing>("sph_okres") {
    val ogc_fid = int("ogc_fid").primaryKey()
    val id = float("id")
    val kod_nuts3 = varchar("kod_nuts3")
    val kod_lau1 = varchar("kod_lau1")
    val nazev_lau1 = varchar("nazev_lau1")
    val wkb_geometry = bytes("wkb_geometry")
}
