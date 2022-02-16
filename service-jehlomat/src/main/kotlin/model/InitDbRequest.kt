package model

import kotlinx.serialization.Serializable

@Serializable
data class InitDbRequest(
    val password: String,
    val superAdminEmail: String,
    val creatGeoTables: Boolean
)
