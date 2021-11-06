package model

import kotlinx.serialization.Serializable

@Serializable
data class Organization(
    val name: String,
    val email: String,
    val password: String,
    var verified: Boolean
)
