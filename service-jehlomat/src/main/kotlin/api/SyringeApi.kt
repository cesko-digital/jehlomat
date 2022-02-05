package api

import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.CSVExportSchema
import model.DateInterval
import model.Role
import model.Syringe
import model.pagination.OrderByDefinition
import model.pagination.OrderByDirection
import model.pagination.PageInfoResult
import model.pagination.ensureValidity
import model.syringe.*
import services.*
import utils.isValidMail
import java.time.Instant


fun Route.syringeApi(database: DatabaseService, jwtManager: JwtManager, mailer: MailerService): Route {

    return route("") {
        authenticate(JWT_CONFIG_NAME) {
            post("/search") {
                val request = call.receive<SyringeFilterRequest>()

                val requestedPageInfo = request.pageInfo.ensureValidity()
                val requestedOrdering = request.ordering.ensureValidity(OrderByDefinition(OrderBySyringeColumn.CREATED_AT, OrderByDirection.DESC))

                val filteredSyringes = database.selectSyringes(request.filter, requestedPageInfo, requestedOrdering)

                val hasMoreRecords = (filteredSyringes.size > requestedPageInfo.size)
                val pageInfo = PageInfoResult(requestedPageInfo.index, requestedPageInfo.size, hasMoreRecords)
                call.respond(HttpStatusCode.OK, SyringeFilterResponse(filteredSyringes, pageInfo))
            }

            post("/export") {
                val loggedInUser = jwtManager.getLoggedInUser(call, database)
                val roles = PermissionService.determineRoles(loggedInUser, loggedInUser)
                if (!roles.contains(Role.OrgAdmin) && !roles.contains(Role.SuperAdmin)) {
                    call.respond(HttpStatusCode.Forbidden, "Only admin or superadmin can export database")
                    return@post
                }

                val request = call.receive<SyringeFilter>()

                val now = Instant.now().epochSecond
                val createdAt = request.createdAt ?: DateInterval(0, now)
                val from = createdAt.from ?: 0
                val to = createdAt.to ?: now

                val halfYear = 60 * 60 * 24 * 30 * 6
                if ((to - from) >  halfYear) {
                    call.respond(HttpStatusCode.BadRequest, "Selected time range is to wide $from - $to")
                    return@post
                }

                val organizationId = if (roles.contains(Role.SuperAdmin)) {
                    null
                } else {
                    loggedInUser.organizationId
                }

                val output = database.selectSyringes(request, organizationId).joinToString("\n") { it.toString() }

                call.response.header(
                    HttpHeaders.ContentDisposition,
                    ContentDisposition.Attachment.withParameter(ContentDisposition.Parameters.FileName, "export.csv")
                        .toString()
                )

                call.respondText(
                    text = CSVExportSchema.header() + "\n" + output,
                    contentType = ContentType.Text.CSV,
                    status = HttpStatusCode.OK,
                )
            }

            put {
                val newSyringe = call.receive<Syringe>()
                val currentSyringe = database.selectSyringeById(newSyringe.id)

                if (currentSyringe == null) {
                    call.respond(HttpStatusCode.NotFound)
                    return@put
                }

                val fieldName = GeneralValidator.validateUnchangeableByPut(currentSyringe, newSyringe)
                if (fieldName != null) {
                    call.respond(HttpStatusCode.BadRequest, "The field $fieldName is unchangeable by PUT request.")
                    return@put
                }

                database.updateSyringe(newSyringe)
                call.respond(HttpStatusCode.OK)
            }
        }

        post {
            val syringe = call.receive<Syringe>()
            if (syringe.createdBy != null) {
                val user = database.selectUserById(syringe.createdBy.id)
                if (user == null) {
                    call.respond(HttpStatusCode.BadRequest, "The founder doesn't exist")
                    return@post
                }
            }

            val location = database.selectOrInsertLocation(syringe.gps_coordinates)

            val syringeId = database.insertSyringe(syringe.copy(location = location))
            if (syringeId == null) {
                call.respond(HttpStatusCode.InternalServerError, "A syringe cannot be created, please try again later")
                return@post
            }

            val teamsInLocation = database.resolveTeamsInLocation(syringe.gps_coordinates)
            teamsInLocation.forEach {
                val organization = database.selectOrganizationById(it.organizationId)
                val admin = database.findAdmin(organization!!)
                mailer.sendSyringeFinding(organization, admin.email, syringeId)
            }

            call.respond(HttpStatusCode.Created, SyringeCreateResponse(id = syringeId, teamAvailable = teamsInLocation.isNotEmpty()))
        }

        route("/{id}") {

            post("/track") {
                val id = call.parameters["id"]
                val syringe = id?.let { it1 -> database.selectSyringeById(it1) }
                val syringeTracking = call.receive<SyringeTrackingRequest>()

                when {
                    (syringe == null) -> {
                        call.respond(HttpStatusCode.NotFound)
                    }
                    (!syringeTracking.email.isValidMail()) -> {
                        call.respond(HttpStatusCode.BadRequest, "The email is not valid.")
                    }
                    else -> {
                        mailer.sendSyringeFindingConfirmation(syringeTracking.email, syringe.id)
                        call.respond(HttpStatusCode.NoContent)
                    }
                }
            }

            authenticate(JWT_CONFIG_NAME) {
                get {
                    val id = call.parameters["id"]
                    val result = id?.let { it1 -> database.selectSyringeById(it1) }
                    if (result != null) {
                        call.respond(HttpStatusCode.OK, result)
                    } else {
                        call.respond(HttpStatusCode.NotFound)
                    }
                }

                delete {
                    val id = call.parameters["id"]

                    if (id != null) {
                        database.deleteSyringe(id)
                        call.respond(HttpStatusCode.OK)
                    } else {
                        call.respond(HttpStatusCode.NotFound)
                    }
                }
            }
        }
    }
}
