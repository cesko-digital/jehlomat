package services

import model.*
import model.team.Team
import model.team.TeamRequest
import model.user.User
import utils.AuthRole
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

class PermissionService {
    companion object {
        private val superAdminEmail = System.getenv("SUPER_ADMIN_EMAIL")

        fun getSuperAdminEmail(): String {
            return superAdminEmail
        }

        fun <T> determineRoles(loggedIdUser: User, targetObj: T?): Set<Role> {
            return when(targetObj) {
                is User -> return determineUserRoles(loggedIdUser, targetObj)
                is Organization -> return determineRolesByOrgId(loggedIdUser, targetObj.id)
                is Team -> return determineRolesByOrgId(loggedIdUser, targetObj.organizationId)
                is TeamRequest -> return determineRolesByOrgId(loggedIdUser, targetObj.organizationId)
                else -> determineSuperAdmin(loggedIdUser)
            }
        }

        private fun determineSuperAdmin(loggedIdUser: User) = if (isUserSuperAdmin(loggedIdUser)) {
            setOf(Role.SuperAdmin)
        } else {
            setOf()
        }

        private fun determineUserRoles(loggedIdUser: User, targetUser: User): Set<Role> {
            val roles = mutableSetOf<Role>()

            if (loggedIdUser.id == targetUser.id) {
                roles.add(Role.UserOwner)
            }

            if (loggedIdUser.organizationId == targetUser.organizationId && loggedIdUser.isAdmin) {
                roles.add(Role.OrgAdmin)
            }

            if (isUserSuperAdmin(loggedIdUser)) {
                roles.add(Role.SuperAdmin)
            }

            return roles
        }

        private fun determineRolesByOrgId(loggedIdUser: User, orgId: Int): Set<Role> {
            val roles = mutableSetOf<Role>()

            if (loggedIdUser.organizationId == orgId && loggedIdUser.isAdmin) {
                roles.add(Role.OrgAdmin)
            }

            if (isUserSuperAdmin(loggedIdUser)) {
                roles.add(Role.SuperAdmin)
            }

            return roles
        }

        fun isUserSuperAdmin(loggedIdUser: User): Boolean {
            return loggedIdUser.email == superAdminEmail
        }

        fun <T> validatePermissions(roles: Set<Role>, currentVersion: T, newVersion: T): PermissionViolation? {
            if (currentVersion == null || newVersion == null) {
                return null
            }

            val kClass = currentVersion.javaClass.kotlin

            for (member in kClass.memberProperties) {
                val annotation = member.findAnnotation<AuthRole>()
                if (annotation != null &&
                    !annotation.cmpType.isSame(member.get(currentVersion), member.get(newVersion)) &&
                    !roles.contains(annotation.role)
                ) {
                    return PermissionViolation(member.name, annotation.role)
                }
            }

            return null
        }
    }
}