package externals

external val navigator: Navigator

external interface Navigator {
     val geolocation: Geolocation
}

external interface Geolocation {
    fun getCurrentPosition(handler: (position: dynamic) -> Unit)
}