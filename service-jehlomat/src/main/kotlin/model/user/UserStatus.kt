package model.user


enum class UserStatus(val code: Int) {
    NOT_VERIFIED(0),
    ACTIVE(1),
    DEACTIVATED(2);

    companion object {
        fun valueOf(code: Int): UserStatus {
            return values().first { it.code == code }
        }
    }
}