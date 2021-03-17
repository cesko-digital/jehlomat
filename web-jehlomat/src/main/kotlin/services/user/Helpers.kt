package services.user

import services.places.AutocompleteResponse

/*
    Some storage for this kind of metadata will be as part of User object.

    This is for testing.
 */
fun getUserHistoryData(): List<AutocompleteResponse> {
    return listOf(
        AutocompleteResponse("Soukenná, Frýdlant, Česko", "EhxTb3VrZW5uw6EsIEZyw71kbGFudCwgxIxlc2tvIi4qLAoUChIJyXqCsw8vCUcRc_rY1BXnDsoSFAoSCdeghlgFLwlHEdWlIzDM763Y"),
        AutocompleteResponse("Soukenná, Jablonec nad Nisou, Česko", "EiVTb3VrZW5uw6EsIEphYmxvbmVjIG5hZCBOaXNvdSwgxIxlc2tvIi4qLAoUChIJ3TfqI87KDkcRdsvfnh1cfWESFAoSCVXCndUsNQlHEXAiFWYPrwAE")
    )
}