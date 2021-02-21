package services

fun buildParametersString(parameters: HashMap<String, Any>): String {
    return parameters.map {
        "${it.key}=${it.value}"
    }.joinToString(
        separator = "&"
    )
}