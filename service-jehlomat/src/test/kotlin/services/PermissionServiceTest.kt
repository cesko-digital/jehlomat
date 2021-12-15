package services

import main.ORGANIZATION
import main.SUPER_ADMIN
import main.TEAM
import main.USER
import model.FieldComparisonType
import model.PermissionViolation
import model.Role
import model.User
import org.junit.Test
import utils.AuthRole
import utils.hashPassword
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class PermissionServiceTest {

    private val orgAdmin = User(
        99,
        "org@admin.org",
        "org admin",
        "aaAA11aa",
        false,
        USER.organizationId,
        2,
        true
    )

    @Test
    fun testDetermineRolesForUser() {
        assertEquals(setOf(Role.UserOwner), PermissionService.determineRoles(USER, USER))
        assertEquals(setOf(Role.OrgAdmin), PermissionService.determineRoles(orgAdmin, USER))
        assertEquals(setOf(Role.OrgAdmin, Role.UserOwner), PermissionService.determineRoles(orgAdmin, orgAdmin))
        assertEquals(setOf(Role.SuperAdmin), PermissionService.determineRoles(SUPER_ADMIN, USER))
        assertEquals(setOf(Role.SuperAdmin, Role.UserOwner), PermissionService.determineRoles(SUPER_ADMIN, SUPER_ADMIN))
    }

    @Test
    fun testDetermineRolesFoTeam() {
        assertEquals(setOf(Role.OrgAdmin), PermissionService.determineRoles(orgAdmin, TEAM))
        assertEquals(setOf(Role.SuperAdmin), PermissionService.determineRoles(SUPER_ADMIN, TEAM))
    }

    @Test
    fun testDetermineRolesForOrganization() {
        assertEquals(setOf(Role.OrgAdmin), PermissionService.determineRoles(orgAdmin, ORGANIZATION))
        assertEquals(setOf(Role.SuperAdmin), PermissionService.determineRoles(SUPER_ADMIN, ORGANIZATION))
    }

    @Test
    fun testIsUserSuperAdmin() {
        assertFalse(PermissionService.isUserSuperAdmin(USER))
        assertTrue(PermissionService.isUserSuperAdmin(SUPER_ADMIN))
    }

    @Test
    fun testValidatePermissions() {
        val orig = TestARoleClass("val1", "pswd1".hashPassword())
        val new = TestARoleClass("val1", "pswd1")
        // not changed, no roles
        assertEquals(null, PermissionService.validatePermissions(setOf(), orig, new))
        // changed default, no roles
        assertEquals(
            PermissionViolation("defField", Role.UserOwner),
            PermissionService.validatePermissions(setOf(), orig, new.copy(defField = "val2"))
        )
        // changed default, bad role
        assertEquals(
            PermissionViolation("defField", Role.UserOwner),
            PermissionService.validatePermissions(setOf(Role.OrgAdmin), orig, new.copy(defField = "val2"))
        )
        // changed password, bad role
        assertEquals(
            PermissionViolation("pswdField", Role.UserOwner),
            PermissionService.validatePermissions(setOf(Role.OrgAdmin), orig, new.copy(pswdField = "pswd2"))
        )
        // changed default, correct role
        assertEquals(
            null,
            PermissionService.validatePermissions(setOf(Role.UserOwner), orig, new.copy(defField = "val2"))
        )
        // changed password, correct role
        assertEquals(
            null,
            PermissionService.validatePermissions(setOf(Role.UserOwner), orig, new.copy(pswdField = "pswd2"))
        )
    }

    data class TestARoleClass (
        @AuthRole(Role.UserOwner) val defField: String,
        @AuthRole(Role.UserOwner, FieldComparisonType.PASSWORD) val pswdField: String
    )
}