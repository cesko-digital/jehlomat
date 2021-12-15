package model

data class PermissionViolation(
    val fieldName: String,
    val role: Role
)
