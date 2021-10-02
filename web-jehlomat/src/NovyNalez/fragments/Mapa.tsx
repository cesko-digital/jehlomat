import L, { LatLngExpression } from 'leaflet';
import { FC, useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from './constants';

// Leaflet hack to make it works
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;
// ------------

interface IMapa {
    userPosition: LatLngExpression | null;
}

const Mapa: FC<IMapa> = ({ userPosition }) => {
    const [position, setPosition] = useState<LatLngExpression>(DEFAULT_POSITION);

    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);

    /**
     * Mělo by nastavit novou pozici, kterou získá z prohlížeče.
     * Pozici nastaví, ale props mapy jsou immutable, takže se
     * lokace do mapy nepropíše.
     *
     * Nepodařilo se mi aplikovat nějaký workaround.
     */
    useEffect(() => {
        if (userPosition) {
            console.log('User position changed:', userPosition);
            setPosition(userPosition);
        }
    }, [userPosition]);

    // Divné chování zoomu, na každý zoom change se sice provolá,
    // map.getCenter(), ale lokace stredu nedava smysl = zůstává
    // pořád stejný, i když je marker na jiné zemi Evropy
    function MapCustomEvents() {
        const map = useMapEvents({
            drag: () => handleMapCenterChange(map, setMarkerPosition),
            zoom: () => handleMapCenterChange(map, setMarkerPosition),
        });

        return null;
    }

    function handleMapCenterChange(map: L.Map, setMarkerPosition: any) {
        const { lat, lng } = map.getCenter();
        console.log('Map center:', map.getCenter());
        setMarkerPosition([lat, lng]);
    }

    return (
        <MapContainer
            center={position}
            zoom={DEFAULT_ZOOM_LEVEL}
            scrollWheelZoom={false}
            style={{ width: '800px', height: '600px', zIndex: 5 }}
            preferCanvas
            whenCreated={map => {
                handleMapCenterChange(map, setMarkerPosition);
            }}
        >
            <MapCustomEvents />
            <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {markerPosition && <Marker position={markerPosition} />}
        </MapContainer>
    );
};

export default Mapa;
