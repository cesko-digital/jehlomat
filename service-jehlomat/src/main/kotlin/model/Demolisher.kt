package model

enum class Demolisher {
    USER {
        override fun czechName() = "nálezce"
    },
    NO {
        override fun czechName() = "nezlikvidováno"
    },
    CITY_POLICE {
        override fun czechName() = "městská policie"
    };

    abstract fun czechName(): String
}