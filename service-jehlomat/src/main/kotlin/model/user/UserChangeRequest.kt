package model.user

import kotlinx.serialization.Serializable

@Serializable
data class UserChangeRequest(
    val email: String,
    val username: String,
    val teamId: Int?
)

fun UserChangeRequest.toUser(user: User) = user.copy(
    email = this.email,
    username = this.username,
    teamId = this.teamId
)
