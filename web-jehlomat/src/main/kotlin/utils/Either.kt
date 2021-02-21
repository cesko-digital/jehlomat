package utils

sealed class Either<out T> {
    data class Error(val message: String? = null, val exception: Exception) : Either<Nothing>()
    data class Success<T>(val value: T) : Either<T>()
}