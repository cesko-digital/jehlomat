package api

import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import model.*
import model.pagination.OrderByDefinition
import model.pagination.OrderByDirection
import model.pagination.PageInfoResult
import model.pagination.ensureValidity
import model.syringe.*
import model.user.toUserInfo
import services.*
import utils.isValidMail
import java.time.Instant

const val MAXIMUM_EXPORT_TIMESPAN = 60 * 60 * 24 * 30 * 6

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
                val createdAtFrom = createdAt.from ?: 0
                val createdAtTo = createdAt.to ?: now
                val demolishedAt = request.demolishedAt ?: DateInterval(0, now)
                val demolishedAtFrom = demolishedAt.from ?: 0
                val demolishedAtTo = demolishedAt.to ?: now

                if (
                    (createdAtTo - createdAtFrom > MAXIMUM_EXPORT_TIMESPAN) &&
                    (demolishedAtTo - demolishedAtFrom > MAXIMUM_EXPORT_TIMESPAN)
                ) {
                    call.respond(HttpStatusCode.BadRequest, "Either demolished or created time range must be limited to half a year")
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
                val newSyringe = call.receive<SyringeFlat>()
                val currentSyringe = database.selectSyringeById(newSyringe.id)

                if (currentSyringe == null) {
                    call.respond(HttpStatusCode.NotFound)
                    return@put
                }

                val fieldName = GeneralValidator.validateUnchangeableByPut(currentSyringe.toFlatObject(), newSyringe)
                if (fieldName != null) {
                    call.respond(HttpStatusCode.BadRequest, "The field $fieldName is unchangeable by PUT request.")
                    return@put
                }

                database.updateSyringe(newSyringe)
                call.respond(HttpStatusCode.OK)
            }
        }

        authenticate(JWT_CONFIG_NAME, optional = true) {
            post {
                val syringeRequest = call.receive<SyringeCreateRequest>()

                val userCreatedBy = jwtManager.getLoggedInUserOptional(call, database)
                val location = database.selectOrInsertLocation(syringeRequest.gps_coordinates)

                val syringe = syringeRequest.toSyringe(location, userCreatedBy?.toUserInfo())
                val syringeId = database.insertSyringe(syringe)
                if (syringeId == null) {
                    call.respond(
                        HttpStatusCode.InternalServerError,
                        "A syringe cannot be created, please try again later"
                    )
                    return@post
                }

                val teamsInLocation = database.resolveTeamsInLocation(syringeRequest.gps_coordinates)
                teamsInLocation.forEach {
                    val organization = database.selectOrganizationById(it.organizationId)
                    val admin = database.findAdmin(organization!!)
                    mailer.sendSyringeFinding(organization, admin.email, syringeId)
                }

                call.respond(
                    HttpStatusCode.Created,
                    SyringeCreateResponse(id = syringeId, teamAvailable = teamsInLocation.isNotEmpty())
                )
            }
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

            get("/info") {
                val id = call.parameters["id"]
                val result = id?.let { it1 -> database.selectSyringeById(it1) }
                if (result != null) {
                    call.respond(HttpStatusCode.OK, result.toSyringeInfo())
                } else {
                    call.respond(HttpStatusCode.NotFound)
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

                put("/summary") {
                    val syringeRequest = call.receive<SyringeCreateRequest>()

                    val syringe = call.parameters["id"]?.let { it1 -> database.selectSyringeById(it1) }
                    if (syringe == null) {
                        call.respond(HttpStatusCode.NotFound)
                        return@put
                    }

                    val currentUser = jwtManager.getLoggedInUser(call, database)
                    if (syringe.createdBy?.id != currentUser.id) {
                        call.respond(HttpStatusCode.Forbidden, "The syringe summary can be changed only by its creator")
                        return@put
                    }

                    val location = database.selectOrInsertLocation(syringeRequest.gps_coordinates)
                    database.updateSyringe(syringe.copy(
                        createdAt = syringeRequest.createdAt,
                        count = syringeRequest.count,
                        note = syringeRequest.note,
                        photo = syringeRequest.photo ?: "",
                        gps_coordinates = syringeRequest.gps_coordinates,
                        location = location,
                    ).toFlatObject())
                    call.respond(HttpStatusCode.NoContent)
                }

                post("/demolish") {
                    val syringe = call.parameters["id"]?.let { it1 -> database.selectSyringeById(it1) }
                    if (syringe == null) {
                        call.respond(HttpStatusCode.NotFound)
                        return@post
                    }

                    if (syringe.demolished) {
                        call.respond(HttpStatusCode.BadRequest, "The syringe is already demolished")
                        return@post
                    }

                    val currentUser = jwtManager.getLoggedInUser(call, database)
                    val now = Instant.now().epochSecond
                    database.updateSyringe(syringe.copy(
                        demolished = true,
                        demolishedBy = currentUser.toUserInfo(),
                        demolishedAt = now
                    ).toFlatObject())
                    call.respond(HttpStatusCode.NoContent)
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
