package model.password

data class PasswordReset(
    val id: Int,
    val userId: Int,
    val code: String,
    val callerIp: String,
    val requestTime: Long,
    val status: PasswordResetStatus
)
