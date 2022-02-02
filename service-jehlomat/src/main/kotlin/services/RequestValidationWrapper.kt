package services

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*

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
            if (loggedInUser.organizationId != id) {
                appCall.respond(
                    HttpStatusCode.Forbidden,
                    "Only a member of the organization can view its objects."
                )
                return false
            }

            return true
        }
    }
}