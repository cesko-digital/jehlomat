package services

import TestUtils.Companion.generateSql
import TestUtils.Companion.valueIsAlmostNow
import api.UserTable
import main.SUPER_ADMIN
import model.DateInterval
import model.Role
import model.location.LocationId
import model.location.LocationType
import model.syringe.*
import org.junit.Assert.assertEquals
import org.junit.Test

class SyringeFilterTransformerTest {
    var database = DatabaseService()
    private val createdByAlias = UserTable.aliased("createdByAliasName")
    private val reservedByAlias = UserTable.aliased("reservedByAliasName")
    private val sqlCommonPart = "select * from syringes where"
    private val emptyFilter = SyringeFilter(
        locationIds = null,
        createdAt = null,
        createdBy = null,
        demolishedAt = null,
        status = null
    )
    private val superAdminLimitation = SyringeRoleLimitation(database, setOf(Role.SuperAdmin), SUPER_ADMIN)

    @Test
    fun testFilterToDslEmptyFilter() {
        val filter = emptyFilter
        val sqlPair = generateSql(SyringeFilterTransformer.filterToDsl(filter, createdByAlias, reservedByAlias, superAdminLimitation), database)
        assertEquals("$sqlCommonPart syringes.id is not null ", sqlPair.first)
        assertEquals(0, sqlPair.second.size)
    }

    @Test
    fun testFilterToDslLocationIds() {
        val filter = emptyFilter.copy(locationIds = setOf(LocationId("1", LocationType.OKRES), LocationId("2", LocationType.OBEC)))
        val sqlPair = generateSql(SyringeFilterTransformer.filterToDsl(filter, createdByAlias, reservedByAlias, superAdminLimitation), database)
        assertEquals("$sqlCommonPart (syringes.id is not null) and ((locations.okres = ?) or (locations.obec = ?)) ", sqlPair.first)
        assertEquals("1", sqlPair.second[0].value)
        assertEquals(2, sqlPair.second[1].value)
    }

    @Test
    fun testFilterToDslCreatedAt() {
        val filter = emptyFilter.copy(createdAt = DateInterval(
            from = 0,
            to = Long.MAX_VALUE
        ))
        val sqlPair = generateSql(SyringeFilterTransformer.filterToDsl(filter, createdByAlias, reservedByAlias, superAdminLimitation), database)
        assertEquals("$sqlCommonPart ((syringes.id is not null) and (syringes.created_at >= ?)) and (syringes.created_at <= ?) ", sqlPair.first)
        assertEquals(0L, sqlPair.second[0].value)
        assertEquals(Long.MAX_VALUE, sqlPair.second[1].value)
    }

    @Test
    fun testFilterToDslCreatedByUser() {
        val filter = emptyFilter.copy(createdBy = SyringeFinder(
            id = 1,
            type = SyringeFinderType.USER
        ))
        val sqlPair = generateSql(SyringeFilterTransformer.filterToDsl(filter, createdByAlias, reservedByAlias, superAdminLimitation), database)
        assertEquals("$sqlCommonPart (syringes.id is not null) and (syringes.created_by = ?) ", sqlPair.first)
        assertEquals(1, sqlPair.second[0].value)
    }

    @Test
    fun testFilterToDslCreatedByTeam() {
        val filter = emptyFilter.copy(createdBy = SyringeFinder(
            id = 1,
            type = SyringeFinderType.TEAM
        ))
        val sqlPair = generateSql(SyringeFilterTransformer.filterToDsl(filter, createdByAlias, reservedByAlias, superAdminLimitation), database)
        assertEquals("$sqlCommonPart (syringes.id is not null) and (\"createdByAliasName\".team_id = ?) ", sqlPair.first)
        assertEquals(1, sqlPair.second[0].value)
    }

    @Test
    fun testFilterToDslCreatedByOrganization() {
        val filter = emptyFilter.copy(createdBy = SyringeFinder(
            id = 1,
            type = SyringeFinderType.ORGANIZATION
        ))
        val sqlPair = generateSql(SyringeFilterTransformer.filterToDsl(filter, createdByAlias, reservedByAlias, superAdminLimitation), database)
        assertEquals("$sqlCommonPart (syringes.id is not null) and (\"createdByAliasName\".organization_id = ?) ", sqlPair.first)
        assertEquals(1, sqlPair.second[0].value)
    }

    @Test
    fun testFilterToDslCreatedByAnonymous() {
        val filter = emptyFilter.copy(createdBy = SyringeFinder(
            id = 0,
            type = SyringeFinderType.ANONYMOUS
        ))
        val sqlPair = generateSql(SyringeFilterTransformer.filterToDsl(filter, createdByAlias, reservedByAlias, superAdminLimitation), database)
        assertEquals("$sqlCommonPart (syringes.id is not null) and (syringes.created_by is null) ", sqlPair.first)
        assertEquals(0, sqlPair.second.size)
    }

    @Test
    fun testFilterToDslDemolishedAt() {
        val filter = emptyFilter.copy(demolishedAt = DateInterval(
            from = 0,
            to = Long.MAX_VALUE
        ))
        val sqlPair = generateSql(SyringeFilterTransformer.filterToDsl(filter, createdByAlias, reservedByAlias, superAdminLimitation), database)
        assertEquals("$sqlCommonPart ((syringes.id is not null) and (syringes.demolished_at >= ?)) and (syringes.demolished_at <= ?) ", sqlPair.first)
        assertEquals(0L, sqlPair.second[0].value)
        assertEquals(Long.MAX_VALUE, sqlPair.second[1].value)
    }

    @Test
    fun testFilterToDslStatusWaiting() {
        val filter = emptyFilter.copy(status = SyringeStatus.WAITING)
        val sqlPair = generateSql(SyringeFilterTransformer.filterToDsl(filter, createdByAlias, reservedByAlias, superAdminLimitation), database)
        assertEquals("$sqlCommonPart ((syringes.id is not null) and ((syringes.reserved_till is null) or (syringes.reserved_till < ?))) and (syringes.demolished_at is null) ", sqlPair.first)
        valueIsAlmostNow(sqlPair.second[0].value as Long)
    }

    @Test
    fun testFilterToDslStatusReserved() {
        val filter = emptyFilter.copy(status = SyringeStatus.RESERVED)
        val sqlPair = generateSql(SyringeFilterTransformer.filterToDsl(filter, createdByAlias, reservedByAlias, superAdminLimitation), database)
        assertEquals("$sqlCommonPart (((syringes.id is not null) and (syringes.reserved_till is not null)) and (syringes.reserved_till >= ?)) and (syringes.demolished_at is null) ", sqlPair.first)
        valueIsAlmostNow(sqlPair.second[0].value as Long)
    }

    @Test
    fun testFilterToDslStatusDemolished() {
        val filter = emptyFilter.copy(status = SyringeStatus.DEMOLISHED)
        val sqlPair = generateSql(SyringeFilterTransformer.filterToDsl(filter, createdByAlias, reservedByAlias, superAdminLimitation), database)
        assertEquals("$sqlCommonPart (syringes.id is not null) and (syringes.demolished_at is not null) ", sqlPair.first)
        assertEquals(0, sqlPair.second.size)
    }
}