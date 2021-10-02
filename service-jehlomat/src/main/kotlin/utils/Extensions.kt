package utils

fun String.isValidMail(): Boolean {
    return "^[A-Za-z](.*)([@]{1})(.{1,})(\\.)(.{1,})".toRegex().matches(this)
}
