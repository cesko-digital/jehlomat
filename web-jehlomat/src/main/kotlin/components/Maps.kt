package components

import externals.googleMapReact.googleMap
import koin
import kotlinext.js.jsObject
import kotlinx.css.*
import react.*
import styled.css
import styled.styledDiv
import utils.IConfig

fun RBuilder.maps() = child(
    component = maps
)

private val maps = functionalComponent<RProps> {
    val config = koin<IConfig>().get()

    val (mapCenter, setMapCenter) = useState(
        Center(
            latitude = 50.5,
            longitude = 14.0
        )
    )

    styledDiv {
        css {
            width = 500.px
            height = 500.px

            position = Position.relative
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
                    setMapCenter(
                        Center(
                            latitude = it.center.lat,
                            longitude = it.center.lng
                        )
                    )
                }
                onClick = {
                    setMapCenter(
                        Center(
                            latitude = it.lat,
                            longitude = it.lng
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
                width = 10.px
                height = 10.px

                position = Position.absolute
                left = 50.pct - 5.px
                top = 50.pct - 5.px

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
            width = 20.px
            height = 20.px

            position = Position.relative
            left = (-10).px
            top = (-10).px

            backgroundColor = Color.blue
        }
    }
}

data class Center(
    val latitude: Number,
    val longitude: Number
)

data class MarkerProps(
    val lat: Number,
    val lng: Number
) : RProps