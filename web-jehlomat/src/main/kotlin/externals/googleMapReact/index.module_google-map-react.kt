@file:Suppress(
    "INTERFACE_WITH_SUPERCLASS",
    "OVERRIDING_FINAL_MEMBER",
    "RETURN_TYPE_MISMATCH_ON_OVERRIDE",
    "CONFLICTING_OVERLOADS",
    "EXTERNAL_DELEGATION",
    "UNUSED"
)
@file:JsModule("google-map-react")

package externals.googleMapReact

import org.w3c.dom.Element
import react.*

@JsName("default")
open external class GoogleMapReact : Component<Props, RState> {
    override fun render(): ReactElement?
}

external interface `T$0` {
    var key: String
}

external interface `T$1` {
    var client: String
    var v: String
}

external interface `T$2` {
    var language: String?
        get() = definedExternally
        set(value) = definedExternally
    var region: String?
        get() = definedExternally
        set(value) = definedExternally
    var libraries: dynamic /* Array<String>? | String? */
        get() = definedExternally
        set(value) = definedExternally
}

external interface MapTypeStyle {
    var elementType: String?
        get() = definedExternally
        set(value) = definedExternally
    var featureType: String?
        get() = definedExternally
        set(value) = definedExternally
    var stylers: Array<Any>
}

external interface `T$3` {
    var position: Number
}

external interface MapOptions {
    var backgroundColor: String?
        get() = definedExternally
        set(value) = definedExternally
    var clickableIcons: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var controlSize: Number?
        get() = definedExternally
        set(value) = definedExternally
    var disableDefaultUI: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var disableDoubleClickZoom: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var draggable: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var draggableCursor: String?
        get() = definedExternally
        set(value) = definedExternally
    var draggingCursor: String?
        get() = definedExternally
        set(value) = definedExternally
    var fullscreenControl: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var fullscreenControlOptions: `T$3`?
        get() = definedExternally
        set(value) = definedExternally
    var gestureHandling: String?
        get() = definedExternally
        set(value) = definedExternally
    var heading: Number?
        get() = definedExternally
        set(value) = definedExternally
    var keyboardShortcuts: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var mapTypeControl: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var mapTypeControlOptions: dynamic
        get() = definedExternally
        set(value) = definedExternally
    var mapTypeId: String?
        get() = definedExternally
        set(value) = definedExternally
    var minZoom: Number?
        get() = definedExternally
        set(value) = definedExternally
    var maxZoom: Number?
        get() = definedExternally
        set(value) = definedExternally
    var noClear: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var options: ((maps: Maps) -> Props)?
        get() = definedExternally
        set(value) = definedExternally
    var panControl: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var panControlOptions: `T$3`?
        get() = definedExternally
        set(value) = definedExternally
    var rotateControl: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var rotateControlOptions: `T$3`?
        get() = definedExternally
        set(value) = definedExternally
    var scaleControl: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var scaleControlOptions: Any?
        get() = definedExternally
        set(value) = definedExternally
    var scrollwheel: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var streetView: Any?
        get() = definedExternally
        set(value) = definedExternally
    var streetViewControl: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var streetViewControlOptions: `T$3`?
        get() = definedExternally
        set(value) = definedExternally
    var styles: Array<MapTypeStyle>?
        get() = definedExternally
        set(value) = definedExternally
    var tilt: Number?
        get() = definedExternally
        set(value) = definedExternally
    var zoomControl: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var zoomControlOptions: `T$3`?
        get() = definedExternally
        set(value) = definedExternally
    var minZoomOverride: Boolean?
        get() = definedExternally
        set(value) = definedExternally
}

external interface Maps {
    var Animation: Any
    var ControlPosition: Any
    var MapTypeControlStyle: Any
    var MapTypeId: Any
    var NavigationControlStyle: Any
    var ScaleControlStyle: Any
    var StrokePosition: Any
    var SymbolPath: Any
    var ZoomControlStyle: Any
    var DirectionsStatus: Any
    var DirectionsTravelMode: Any
    var DirectionsUnitSystem: Any
    var DistanceMatrixStatus: Any
    var DistanceMatrixElementStatus: Any
    var ElevationStatus: Any
    var GeocoderLocationType: Any
    var GeocoderStatus: Any
    var KmlLayerStats: Any
    var MaxZoomStatus: Any
    var StreetViewStatus: Any
    var TransitMode: Any
    var TransitRoutePreference: Any
    var TravelMode: Any
    var UnitSystem: Any
}

external interface Bounds {
    var nw: Coords
    var ne: Coords
    var sw: Coords
    var se: Coords
}

external interface Point {
    var x: Number
    var y: Number
}

external interface NESWBounds {
    var ne: Coords
    var sw: Coords
    var nw: Coords?
        get() = definedExternally
        set(value) = definedExternally
    var se: Coords?
        get() = definedExternally
        set(value) = definedExternally
}

external interface Coords {
    var lat: Number
    var lng: Number
}

external interface Size {
    var width: Number
    var height: Number
}

external interface ClickEventValue : Point, Coords {
    var event: Any
}

external interface ChangeEventValue {
    var center: Coords
    var zoom: Number
    var bounds: Bounds
    var marginBounds: Bounds
    var size: Size
}

external interface Position {
    var lat: Number
    var lng: Number
    var weight: Number?
        get() = definedExternally
        set(value) = definedExternally
}

external interface `T$4` {
    var radius: Number?
        get() = definedExternally
        set(value) = definedExternally
    var opacity: Number?
        get() = definedExternally
        set(value) = definedExternally
}

external interface Heatmap {
    var positions: Array<Position>
    var options: `T$4`
}

external interface `T$5` {
    var map: Any
    var maps: Any
    var ref: Element?
}

external interface Props : RProps {
    var bootstrapURLKeys: dynamic /* `T$0`? | `T$1`? */
        get() = definedExternally
        set(value) = definedExternally
    var defaultCenter: Coords?
        get() = definedExternally
        set(value) = definedExternally
    var center: Coords?
        get() = definedExternally
        set(value) = definedExternally
    var defaultZoom: Number?
        get() = definedExternally
        set(value) = definedExternally
    var zoom: Number?
        get() = definedExternally
        set(value) = definedExternally
    var heatmapLibrary: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var hoverDistance: Number?
        get() = definedExternally
        set(value) = definedExternally
    var options: MapOptions? /* MapOptions? | ((maps: Maps) -> MapOptions)? */
        get() = definedExternally
        set(value) = definedExternally
    var margin: Array<Any>?
        get() = definedExternally
        set(value) = definedExternally
    var debounced: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var draggable: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var layerTypes: Array<String>?
        get() = definedExternally
        set(value) = definedExternally
    var onClick: ((value: ClickEventValue) -> Any)?
    var onChange: ((value: ChangeEventValue) -> Any)?
    var resetBoundsOnResize: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    val onChildClick: ((hoverKey: Any, childProps: Any) -> Unit)?
    val onChildMouseEnter: ((hoverKey: Any, childProps: Any) -> Unit)?
    val onChildMouseLeave: ((hoverKey: Any, childProps: Any) -> Unit)?
    val onChildMouseDown: ((childKey: Any, childProps: Any, mouse: Any) -> Unit)?
    val onChildMouseUp: ((childKey: Any, childProps: Any, mouse: Any) -> Unit)?
    val onChildMouseMove: ((childKey: Any, childProps: Any, mouse: Any) -> Unit)?
    var onDrag: ((map: Any) -> Unit)?
    var onDragEnd: ((map: Any) -> Unit)?
    val onZoomAnimationStart: ((args: Any) -> Unit)?
    val onZoomAnimationEnd: ((args: Any) -> Unit)?
    val onMapTypeIdChange: ((args: Any) -> Unit)?
    val distanceToMouse: ((pt: Point, mousePos: Point, markerProps: Any?) -> Number)?
    val googleMapLoader: ((bootstrapURLKeys: Any) -> Unit)?
    val onGoogleApiLoaded: ((maps: `T$5`) -> Unit)?
    val onTilesLoaded: (() -> Unit)?
    var yesIWantToUseGoogleMapApiInternals: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var shouldUnregisterMapOnUnmount: Boolean?
        get() = definedExternally
        set(value) = definedExternally
    var heatmap: Heatmap?
        get() = definedExternally
        set(value) = definedExternally
}

external interface ChildComponentProps : Coords {
    var `$hover`: Boolean?
        get() = definedExternally
        set(value) = definedExternally
}

external interface Tile : Point {
    var zoom: Number
}

external interface `T$6` {
    var ne: Coords
    var sw: Coords
}

external interface `T$7` {
    var nw: Coords
    var se: Coords
}

external interface `T$8` {
    var lat: Number
    var lng: Number
}

external interface `T$9` {
    var center: `T$8`
    var zoom: Number
    var newBounds: Bounds
}

external interface `T$10` {
    var w: Number
    var h: Number
}

external interface `T$11` {
    var coords: Coords
}

external interface `T$12` {
    var point: Point
}

external interface `T$13` {
    var from: Number
    var to: Number
}