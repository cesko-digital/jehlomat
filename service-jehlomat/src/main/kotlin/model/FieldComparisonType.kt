package model

import org.mindrot.jbcrypt.BCrypt

enum class FieldComparisonType {
    DEFAULT {
        override fun <T> isSame(currentValue: T, newValue: T): Boolean {
            return newValue == currentValue
        }
    },
    PASSWORD {
        override fun <T> isSame(currentValue: T, newValue: T): Boolean {
            return BCrypt.checkpw(newValue as String, currentValue as String)
        }
    };

    abstract fun <T> isSame(currentValue: T, newValue: T): Boolean
}