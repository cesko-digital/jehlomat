package model

import kotlinx.serialization.Serializable

@Serializable
data class OrganizationRegistration (
    val name: String,
    val email: String,
    val password: String

)