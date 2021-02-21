package utils

import externals.process

interface IConfig {
    fun get(): Config
}

class LocalConfig : IConfig {
    override fun get(): Config {
        return Config(
            userServiceUrl = "http://localhost:8081/api/v1/users",
            jehlomatServiceUrl = "http://localhost:8082/api/v1/jehlomat",
            googleMapsKey = when (process.env.GOOGLE_MAPS_KEY) {
                undefined -> ""
                else -> process.env.GOOGLE_MAPS_KEY as String
            }
        )
    }
}

class ProductionConfig : IConfig {
    override fun get(): Config {
        return Config(
            userServiceUrl = "https://app.jehlomat.cz/api/v1/users",
            jehlomatServiceUrl = "https://app.jehlomat.cz/api/v1/jehlomat",
            googleMapsKey = when (process.env.GOOGLE_MAPS_KEY) {
                undefined -> {
                    throw Exception("Missing GOOGLE_MAPS_KEY env variable.")
                }
                else -> process.env.GOOGLE_MAPS_KEY as String
            }
        )
    }
}

data class Config(
    val userServiceUrl: String,
    val jehlomatServiceUrl: String,
    val googleMapsKey: String
)