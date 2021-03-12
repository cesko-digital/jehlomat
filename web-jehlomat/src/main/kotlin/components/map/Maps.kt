package components.map

import components.utils.verticalDivider
import externals.googleMapReact.googleMap
import koin
import kotlinext.js.jsObject
import kotlinx.css.*
import react.*
import store.HistoryType
import store.appStore
import store.reducers.Location
import store.reducers.UpdateLocation
import store.useRedux
import styled.StyleSheet
import styled.css
import styled.styledDiv
import utils.IConfig

fun RBuilder.maps(

) = child(
    component = maps
)

private object MapsStyles : StyleSheet("MapsStyles", true) {
    val mapContainer by css {
        position = Position.absolute
        top = 0.px
        left = 0.px
        right = 0.px
        bottom = 0.px

        zIndex = 0
    }

    val mapControls by css {
        display = Display.flex
        flexDirection = FlexDirection.column

        position = Position.absolute
        zIndex = 100
        bottom = 130.px
        left = 16.px
    }
}

private val mapTypeToTitleMap = hashMapOf(
    "roadmap" to "Map",
    "hybrid" to "Sat"
)

/*
    Returns (currentType, nextType, switchFunction)
 */
private fun useMapTypes(): Triple<String, String, () -> Unit> {
    val mapTypes = listOf(
        "roadmap",
        "hybrid"
    )

    val (mapStyle, setMapStyle) = useState(0)

    fun switchMapType() {
        setMapStyle((mapStyle + 1) % mapTypes.size)
    }

    return Triple(mapTypes[mapStyle], mapTypes[(mapStyle + 1) % mapTypes.size], ::switchMapType)
}

/*
    Returns (currentZoom, plusFuntion, minusFunction)
 */
private fun useMapZoom(default: Int): Triple<Int, () -> Unit, () -> Unit> {
    val (zoom, setZoom) = useState(default)

    fun plus() {
        if (zoom < 20) {
            setZoom(zoom + 1)
        }
    }

    fun minus() {
        if (zoom > 0) {
            setZoom(zoom - 1)
        }
    }

    return Triple(zoom, ::plus, ::minus)
}

private val maps = functionalComponent<RProps> {
    val config = koin<IConfig>().get()

    val (mapCenter, dispatchLocationAction) = useRedux<Location, UpdateLocation> {
        appStore.getState().newFindingState.location
    }

    val (mapType, nextMapType, switchMapType) = useMapTypes()
    val (mapZoom, plusZoom, minusZoom) = useMapZoom(
        default = 16
    )

    styledDiv {
        css {
            +MapsStyles.mapContainer
        }

        googleMap {
            attrs {
                bootstrapURLKeys = jsObject {
                    this.key = config.googleMapsKey
                }
                center = jsObject {
                    lat = mapCenter.latitude
                    lng = mapCenter.longitude
                }
                zoom = mapZoom
                yesIWantToUseGoogleMapApiInternals = true

                options = jsObject {
                    rotateControl = false
                    disableDefaultUI = true
                    mapTypeId = mapType
                }

                onChange = {
                    dispatchLocationAction(
                        UpdateLocation(
                            latitude = it.center.lat.toDouble(),
                            longitude = it.center.lng.toDouble()
                        ),
                        HistoryType.None
                    )
                }
                onClick = {
                    dispatchLocationAction(
                        UpdateLocation(
                            latitude = it.lat.toDouble(),
                            longitude = it.lng.toDouble()
                        ),
                        HistoryType.None
                    )
                }
            }
        }

        centerMarker(
            width = 61,
            height = 88
        )

        styledDiv {
            css {
                +MapsStyles.mapControls
            }
            mapZoomControl(
                onPlus = { plusZoom() },
                onMinus = { minusZoom() }
            )
            verticalDivider(16)
            mapTypeControl(
                title = mapTypeToTitleMap.getOrElse(nextMapType) { "" },
                onSwitch = {
                    switchMapType()
                }
            )
        }
    }
}
