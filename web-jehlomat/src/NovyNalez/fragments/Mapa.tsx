import L, { LatLngExpression } from "leaflet";
import { FC, SetStateAction, useEffect, useRef, useState } from "react";
import {
  MapConsumer,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from "./constants";

// Leaflet hack
import "leaflet/dist/leaflet.css";
// @ts-ignore
import icon from "leaflet/dist/images/marker-icon.png";
// @ts-ignore
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;
// ------------

interface IMapa {
  lat?: number;
  long?: number;
}

const Mapa: FC<IMapa> = ({ lat, long }) => {
  const [position, setPosition] = useState<LatLngExpression>(DEFAULT_POSITION);

  const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(
    null
  );

  /**
   * Sets new position after change of Latitude and Longtitude after getting
   * users geolocation from BrowserAPI
   */

  useEffect(() => {
    if (lat && Number(lat) && long && Number(long)) {
      setPosition([lat, long]);
    }
  }, [lat, long]);

  function MapCustomEvents() {
    const map = useMapEvents({
      drag: () => handleMapCenterChange(map, setMarkerPosition),
    });

    return null;
  }

  function handleMapCenterChange(map: L.Map, setMarkerPosition: any) {
    const { lat, lng } = map.getCenter();
    console.log("Map center:", map.getCenter());
    setMarkerPosition([lat, lng]);
  }

  return (
    <MapContainer
      center={position}
      zoom={DEFAULT_ZOOM_LEVEL}
      scrollWheelZoom={false}
      style={{ width: "800px", height: "600px" }}
      preferCanvas
      // get access to the map instance
      whenCreated={(map) => {
        handleMapCenterChange(map, setMarkerPosition);
      }}
    >
      <MapCustomEvents />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markerPosition && <Marker position={markerPosition} />}
    </MapContainer>
  );
};

export default Mapa;
