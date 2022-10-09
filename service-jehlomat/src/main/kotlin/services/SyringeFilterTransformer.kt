package services

import api.LocationTable
import api.SyringeTable
import api.UserTable
import model.*
import model.location.LocationId
import model.location.LocationType
import model.syringe.*
import org.ktorm.dsl.*
import org.ktorm.schema.Column
import org.ktorm.schema.ColumnDeclaring
import java.time.LocalDateTime
import java.time.ZoneOffset

private val ALWAYS_TRUE: ColumnDeclaring<Boolean> = SyringeTable.id.isNotNull()

class SyringeFilterTransformer {

    companion object {
        fun filterToDsl(
            filter: SyringeFilter,
            createdByUserAlias: UserTable,
            reservedByUserAlias: UserTable,
            roleLimitation: SyringeRoleLimitation
        ): ColumnDeclaring<Boolean>{
            var result = ALWAYS_TRUE
            result = transformLocationIds(result, filter.locationIds)
            result = transformDateInterval(result, SyringeTable.createdAt, filter.createdAt)
            result = transformCreatedBy(result, filter.createdBy, createdByUserAlias)
            result = transformDateInterval(result, SyringeTable.demolishedAt, filter.demolishedAt)
            result = transformStatus(result, filter.status)
            result = roleLimitation.addLimitation(result, createdByUserAlias, reservedByUserAlias)

            return result
        }

        private fun transformLocationIds(
            filter: ColumnDeclaring<Boolean>,
            locationIds: Set<LocationId>?
        ): ColumnDeclaring<Boolean> {
            if (locationIds.isNullOrEmpty()) {
                return filter
            }

            var filterLocation:ColumnDeclaring<Boolean>? = null
            for (locationId in locationIds) {
                val add = when (locationId.type) {
                    LocationType.OKRES -> LocationTable.okres eq locationId.id
                    LocationType.OBEC -> LocationTable.obec eq locationId.id.toInt()
                    LocationType.MC -> LocationTable.mestka_cast eq locationId.id.toInt()
                }
                if (filterLocation != null) {
                    filterLocation = filterLocation or add
                } else {
                    filterLocation =  add
                }

            }
            return filter and (filterLocation!!)
        }

        private fun transformStatus(
            filter: ColumnDeclaring<Boolean>,
            status: SyringeStatus?
        ): ColumnDeclaring<Boolean> {
            if (status == null) {
                return filter
            }

            return when (status) {
                SyringeStatus.DEMOLISHED ->
                    filter and (SyringeTable.demolishedAt.isNotNull())
                SyringeStatus.RESERVED -> (
                        filter
                        and (SyringeTable.reservedTill.isNotNull())
                        and (SyringeTable.reservedTill greaterEq LocalDateTime.now().toEpochSecond(ZoneOffset.UTC))
                        and (SyringeTable.demolishedAt.isNull())
                    )
                SyringeStatus.WAITING -> (
                        filter
                        and (
                            SyringeTable.reservedTill.isNull()
                            or (SyringeTable.reservedTill less LocalDateTime.now().toEpochSecond(ZoneOffset.UTC))
                        )
                        and (SyringeTable.demolishedAt.isNull())
                    )
            }
        }

        private fun transformCreatedBy(
            filter: ColumnDeclaring<Boolean>,
            createdBy: SyringeFinder?,
            createdByUserAlias: UserTable
        ): ColumnDeclaring<Boolean> {
            if (createdBy == null) {
                return filter
            }

            return when (createdBy.type) {
                SyringeFinderType.ANONYMOUS ->
                    filter and (SyringeTable.createdBy.isNull())
                SyringeFinderType.USER ->
                    filter and (SyringeTable.createdBy eq createdBy.id)
                SyringeFinderType.TEAM ->
                    filter and (createdByUserAlias.teamId eq createdBy.id)
                SyringeFinderType.ORGANIZATION ->
                    filter and (createdByUserAlias.organizationId eq createdBy.id)
            }
        }

        private fun transformDateInterval(filter: ColumnDeclaring<Boolean>, column: Column<Long>, dateInterval: DateInterval?): ColumnDeclaring<Boolean> {
            var result = filter

            if (dateInterval == null) {
                return result
            }

            if (dateInterval.from != null) {
                result = (result and (column greaterEq dateInterval.from))
            }

            if (dateInterval.to != null) {
                result = (result and (column lessEq dateInterval.to))
            }

            return result
        }
    }
}