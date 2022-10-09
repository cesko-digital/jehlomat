package services

import TestUtils.Companion.generateSql
import TestUtils.Companion.valueIsAlmostNow
import api.SyringeTable
import api.UserTable
import main.USER
import main.team
import model.Organization
import model.Role
import org.junit.Assert
import org.junit.Test
import org.ktorm.dsl.isNotNull
import kotlin.test.AfterTest
import kotlin.test.BeforeTest

class SyringeRoleLimitationTest {
    var database = DatabaseService()
    private val createdByAlias = UserTable.aliased("createdByAliasName")
    private val reservedByAlias = UserTable.aliased("reservedByAliasName")

    @BeforeTest
    fun beforeEach() {
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
        database.cleanLocation()
    }

    @AfterTest
    fun afterEach() {
        database.cleanUsers()
        database.cleanTeams()
        database.cleanOrganizations()
        database.cleanLocation()
    }

    @Test
    fun testBestRoleSelection() {
        Assert.assertEquals(Role.SuperAdmin, SyringeRoleLimitation(database, setOf(Role.SuperAdmin, Role.OrgAdmin, Role.UserOwner), USER).role)
        Assert.assertEquals(Role.OrgAdmin, SyringeRoleLimitation(database, setOf(Role.OrgAdmin, Role.UserOwner), USER).role)
        Assert.assertEquals(Role.UserOwner, SyringeRoleLimitation(database, setOf(Role.UserOwner), USER).role)
        Assert.assertEquals(null, SyringeRoleLimitation(database, setOf(), USER).role)
    }

    @Test
    fun testSuperAdminLimitation() {
        val limitation = SyringeRoleLimitation(database, setOf(Role.SuperAdmin), USER)
        val sqlPair = generateSql(limitation.addLimitation(SyringeTable.id.isNotNull(), createdByAlias, reservedByAlias), database)
        Assert.assertEquals("select * from syringes where syringes.id is not null ", sqlPair.first)
    }

    @Test
    fun testOrgAdminWithoutTeamLocationsLimitation() {
        val limitation = SyringeRoleLimitation(database, setOf(Role.OrgAdmin), USER)
        val sqlPair = generateSql(limitation.addLimitation(SyringeTable.id.isNotNull(), createdByAlias, reservedByAlias), database)
        Assert.assertEquals("select * from syringes where ((\"createdByAliasName\".organization_id = ?) or ((((syringes.reserved_till >= ?) and (\"reservedByAliasName\".organization_id = ?)) and (syringes.demolished_by is null)) and (syringes.created_by is null))) and (syringes.id is not null) ", sqlPair.first)
    }

    @Test
    fun testOrgAdminLimitation() {
        val defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", true))
        val defaultTeamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
        val defaultLocation = database.selectTeamById(defaultTeamId)?.locations?.first()!!

        val limitation = SyringeRoleLimitation(database, setOf(Role.OrgAdmin), USER.copy(organizationId = defaultOrgId))
        val sqlPair = generateSql(limitation.addLimitation(SyringeTable.id.isNotNull(), createdByAlias, reservedByAlias), database)
        Assert.assertEquals("select * from syringes where (((\"createdByAliasName\".organization_id = ?) or ((((syringes.reserved_till >= ?) and (\"reservedByAliasName\".organization_id = ?)) and (syringes.demolished_by is null)) and (syringes.created_by is null))) or (((((syringes.reserved_till is null) or (syringes.reserved_till < ?)) and (syringes.demolished_at is null)) and (syringes.created_by is null)) and (syringes.location_id in (?)))) and (syringes.id is not null) ", sqlPair.first)
        Assert.assertEquals(defaultOrgId, sqlPair.second[0].value)
        valueIsAlmostNow(sqlPair.second[1].value as Long)
        Assert.assertEquals(defaultOrgId, sqlPair.second[2].value)
        valueIsAlmostNow(sqlPair.second[3].value as Long)
        Assert.assertEquals(defaultLocation.id, sqlPair.second[4].value)
    }

    @Test
    fun testUserWithoutTeamLimitation() {
        val defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", true))
        val defaultTeamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
        database.selectTeamById(defaultTeamId)?.locations?.first()!!

        val limitation = SyringeRoleLimitation(database, setOf(Role.UserOwner), USER.copy(organizationId = defaultOrgId))
        val sqlPair = generateSql(limitation.addLimitation(SyringeTable.id.isNotNull(), createdByAlias, reservedByAlias), database)
        Assert.assertEquals("select * from syringes where (\"createdByAliasName\".user_id = ?) and (syringes.id is not null) ", sqlPair.first)
        Assert.assertEquals(USER.id, sqlPair.second[0].value)
    }

    @Test
    fun testUserLimitation() {
        val defaultOrgId = database.insertOrganization(Organization(0, "defaultOrgName", true))
        val defaultTeamId = database.insertTeam(team.copy(organizationId = defaultOrgId))
        val defaultLocation = database.selectTeamById(defaultTeamId)?.locations?.first()!!

        val limitation = SyringeRoleLimitation(database, setOf(Role.UserOwner), USER.copy(organizationId = defaultOrgId, teamId = defaultTeamId))
        val sqlPair = generateSql(limitation.addLimitation(SyringeTable.id.isNotNull(), createdByAlias, reservedByAlias), database)
        Assert.assertEquals("select * from syringes where ((\"createdByAliasName\".user_id = ?) or (((((syringes.reserved_till is null) or (syringes.reserved_till < ?)) and (syringes.demolished_at is null)) and (syringes.created_by is null)) and (syringes.location_id in (?)))) and (syringes.id is not null) ", sqlPair.first)
        Assert.assertEquals(USER.id, sqlPair.second[0].value)
        valueIsAlmostNow(sqlPair.second[1].value as Long)
        Assert.assertEquals(defaultLocation.id, sqlPair.second[2].value)
    }
}