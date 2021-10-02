import L, { LatLngExpression } from "leaflet";
import { FC, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

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

  /**
   * Sets new position after change of Latitude and Longtitude after getting
   * users geolocation from BrowserAPI
   */
  useEffect(() => {
    if (lat && Number(lat) && long && Number(long)) {
      setPosition([lat, long]);
    }
  }, [lat, long]);

  return (
    <MapContainer
      center={position}
      zoom={DEFAULT_ZOOM_LEVEL}
      scrollWheelZoom={false}
      style={{ width: "800px", height: "600px" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Mapa;
