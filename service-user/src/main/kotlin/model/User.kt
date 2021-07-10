package model

data class User(
    val username: String,
    val password: String,
    val email: String,
    val organization: String?,
    val phone_number: String?,
    val verified: Boolean
)
