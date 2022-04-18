package model.password

import api.PasswordResetTable.code

enum class PasswordResetStatus(val code: Int) {
    NEW(0),
    UTILIZED(1),
    OLDER(2);


    companion object {
        fun valueOf(code: Int): PasswordResetStatus {
            return values().first { it.code == code }
        }
    }
}
