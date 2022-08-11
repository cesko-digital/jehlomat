package model

import kotlinx.serialization.Serializable

@Serializable
data class ValidationErrorResponse (
    val fieldName: String,
    val status: String,
)