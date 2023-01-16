package services

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import model.password.PasswordReset
import model.password.PasswordResetStatus
import model.user.User
import services.PermissionService.Companion.isUserSuperAdmin
import java.time.Instant

private const val PASSWORD_RESET_LIFESPAN_SEC = 7200

class RequestValidationWrapper {
    companion object {
        suspend fun <T> validatePutObject(
            appCall: ApplicationCall,
            jwtManager: JwtManager,
            database: DatabaseService,
            currentVersion: T,
            newVersion: T
        ): Boolean {
            val fieldName = GeneralValidator.validateUnchangeableByPut(currentVersion, newVersion)
            if (fieldName != null) {
                appCall.respond(
                    HttpStatusCode.BadRequest,
                    "The field $fieldName is unchangeable by PUT request."
                )
                return false
            }

            val loggedInUser = jwtManager.getLoggedInUser(appCall, database)
            val roles = PermissionService.determineRoles(loggedInUser, newVersion)
            val permViolation = PermissionService.validatePermissions(roles, currentVersion, newVersion)
            if (permViolation != null) {
                appCall.respond(
                    HttpStatusCode.Forbidden,
                    "The field ${permViolation.fieldName} is unchangeable without ${permViolation.role} role."
                )
                return false
            }

            return true
        }

        suspend fun validateOrganizationRequest(
            appCall: ApplicationCall,
            jwtManager: JwtManager,
            database: DatabaseService,
            id: Int?,
        ): Boolean {
            val organization = id?.let { it1 -> database.selectOrganizationById(it1) }
            if (organization == null) {
                appCall.respond(HttpStatusCode.NotFound, "Organization not found")
                return false
            }

            val loggedInUser = jwtManager.getLoggedInUser(appCall, database)
            if (loggedInUser.organizationId != id && !isUserSuperAdmin(loggedInUser)) {
                appCall.respond(
                    HttpStatusCode.Forbidden,
                    "Only a member of the organization or super admin can view its objects."
                )
                return false
            }

            return true
        }

        suspend fun validatePasswordResetRequest(
            appCall: ApplicationCall,
            passwordReset: PasswordReset?,
            user: User?
        ): Boolean {
            return when {
                passwordReset == null -> {
                    appCall.respond(HttpStatusCode.NotFound)
                    false
                }
                user == null -> {
                    appCall.respond(HttpStatusCode.NotFound)
                    false
                }
                user.id != passwordReset.userId -> {
                    appCall.respond(HttpStatusCode.NotFound)
                    false
                }
                passwordReset.status != PasswordResetStatus.NEW -> {
                    appCall.respond(HttpStatusCode.NotFound)
                    false
                }
                passwordReset.requestTime + PASSWORD_RESET_LIFESPAN_SEC < Instant.now().epochSecond -> {
                    appCall.respond(HttpStatusCode.NotFound)
                    false
                }
                else -> true
            }
        }
    }
}