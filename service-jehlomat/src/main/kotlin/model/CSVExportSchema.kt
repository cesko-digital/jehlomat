package model

import kotlinx.serialization.Serializable

@Serializable
data class CSVExportSchema(
    val id: String,
    val createdTimestamp: Long,
    val createdByEmail: String?,
    val createdByUsername: String?,
    val destroyedByEmail: String?,
    val destroyedByUsername: String?,
    val destroyedTimestamp: Long?,
    val demolishingType: String?,
    val count: Int?,
    val gpsCoordinates: String?,
    val okres: String,
    val mc: String,
    val obec: String,
    val destroyed: String,
    val teamName: String?,
    val organizationName: String?
){
    override fun toString(): String =
        "$id,$createdTimestamp,$createdByEmail,$createdByUsername,$destroyedByEmail,$destroyedByUsername,$destroyedTimestamp,$demolishingType,$count,$gpsCoordinates,$okres,$mc,$obec,$destroyed,$teamName,$organizationName"

    companion object {
        fun header(): String = "id,čas nalezení,email nálezce,jméno nálezce,email sběrače,jmeno sběrače,cas sběru,typ zničení,počet,gps,okres,městská část,obec,zneškodněno,tým,organizace"
    }
}

