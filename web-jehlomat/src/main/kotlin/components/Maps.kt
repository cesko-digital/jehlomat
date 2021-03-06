package components

import externals.googleMapReact.googleMap
import koin
import kotlinext.js.jsObject
import kotlinx.css.*
import react.*
import store.appStore
import store.dispatch2
import store.reducers.UpdateLocation
import styled.StyleSheet
import styled.css
import styled.styledDiv
import utils.IConfig

fun RBuilder.maps() = child(
    component = maps
)

object MapsStyles : StyleSheet("MapsStyles", true) {
    val mapContainer by css {
        position = Position.absolute
        top = 0.px
        left = 0.px
        right = 0.px
        bottom = 0.px

        zIndex = 0
    }

    val mapMarker by css {
        width = 20.px
        height = 20.px

        position = Position.relative
        left = (-10).px
        top = (-10).px
    }

    val overlayMarker by css {
        width = 10.px
        height = 10.px

        position = Position.absolute
        left = 50.pct - 5.px
        top = 50.pct - 5.px
    }
}

private val maps = functionalComponent<RProps> {
    val config = koin<IConfig>().get()

    val (mapCenter, setMapCenter) = useState(
        appStore.getState().newFindingState.location
    )

    useEffectWithCleanup {
        appStore.subscribe {
            if (mapCenter != appStore.getState().newFindingState.location) {
                setMapCenter(
                    appStore.getState().newFindingState.location
                )
            }
        }
    }

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
                zoom = 11
                yesIWantToUseGoogleMapApiInternals = true

                onChange = {
                    appStore.dispatch2(
                        UpdateLocation(
                            latitude = it.center.lat.toDouble(),
                            longitude = it.center.lng.toDouble()
                        )
                    )
                }
                onClick = {
                    appStore.dispatch2(
                        UpdateLocation(
                            latitude = it.lat.toDouble(),
                            longitude = it.lng.toDouble()
                        )
                    )
                }
            }
            marker(
                latitude = mapCenter.latitude,
                longitude = mapCenter.longitude
            )
        }

        styledDiv {
            css {
                +MapsStyles.overlayMarker

                backgroundColor = Color.red
            }
        }
    }
}

fun RBuilder.marker(
    latitude: Number,
    longitude: Number
) = child(
    component = marker,
    props = MarkerProps(
        lat = latitude,
        lng = longitude
    )
)

private val marker = functionalComponent<MarkerProps> {

    styledDiv {
        css {
            +MapsStyles.mapMarker

            backgroundColor = Color.blue
        }
    }
}

data class MarkerProps(
    val lat: Number,
    val lng: Number
) : RProps