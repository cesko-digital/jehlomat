package services.user

import services.places.AutocompleteResponse

/*
    Some storage for this kind of metadata will be as part of User object.

    This is for testing.
 */
fun getUserHistoryData(): List<AutocompleteResponse> {
    return listOf(
        AutocompleteResponse("Soukenná, Frýdlant, Česko", "3"),
        AutocompleteResponse("Soukenná, Jablonec nad Nisou, Česko", "1")
    )
}