package model.team

import api.SyringeTable.photo
import model.location.Location
import model.location.LocationId
import model.location.LocationType

data class Team(
    val id: Int,
    val name: String,
    val locations: List<Location>,
    val organizationId: Int
)

fun Team.toRequest() = TeamRequest(
    id = id,
    name = name,
    locationIds = locations.map { loc -> when {
        loc.mestkaCast != null -> LocationId(loc.mestkaCast.toString(), LocationType.MC)
        loc.obec != null -> LocationId(loc.obec.toString(), LocationType.OBEC)
        else -> LocationId(loc.okres, LocationType.OKRES)
    } }.toList(),
    organizationId = organizationId
)
