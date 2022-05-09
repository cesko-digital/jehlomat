package model.user

import kotlinx.serialization.Serializable

@Serializable
data class OrgAdminVerificationRequest(
    val code: String,
    val userId: Int
)
