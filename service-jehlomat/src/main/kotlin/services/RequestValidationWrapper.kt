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
    }
}