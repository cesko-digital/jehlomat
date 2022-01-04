package services

import api.OrganizationTable
import api.SyringeTable
import api.UserTable
import model.*
import model.syringe.SyringeFilter
import model.syringe.SyringeFinder
import model.syringe.SyringeFinderType
import model.syringe.SyringeStatus
import org.ktorm.dsl.*
import org.ktorm.schema.Column
import org.ktorm.schema.ColumnDeclaring
import java.time.LocalDateTime
import java.time.ZoneOffset

private val ALWAYS_TRUE: ColumnDeclaring<Boolean> = SyringeTable.id.isNotNull()

class SyringeFilterTransformer {

    companion object {
        fun filterToDsl(filter: SyringeFilter, createdByUserAlias: UserTable, organizationId: Int?=null): ColumnDeclaring<Boolean>{
            var result = ALWAYS_TRUE
            result = transformLocationIds(result, filter.locationIds)
            result = transformDateInterval(result, SyringeTable.createdAt, filter.createdAt)
            result = transformCreatedBy(result, filter.createdBy, createdByUserAlias)
            result = transformDateInterval(result, SyringeTable.demolishedAt, filter.demolishedAt)
            result = transformStatus(result, filter.status)
            result = transformOrganizationIds(result, organizationId)

            return result
        }

        private fun transformLocationIds(
            filter: ColumnDeclaring<Boolean>,
            locationIds: Set<Int>?
        ): ColumnDeclaring<Boolean> {
            if (locationIds.isNullOrEmpty()) {
                return filter
            }
            return filter and (SyringeTable.locationId inList locationIds)
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

        private fun transformOrganizationIds(
            filter: ColumnDeclaring<Boolean>,
            organizationId: Int?
        ): ColumnDeclaring<Boolean> {
            if (organizationId == null) {
                return filter
            }
            return filter and (OrganizationTable.organizationId eq organizationId)
        }


    }
}