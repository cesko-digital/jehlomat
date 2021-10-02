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
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
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
            style={{ width: '360px', height: '705px', zIndex: 1 }}
            preferCanvas
            whenCreated={map => {
                handleMapCenterChange(map, setMarkerPosition);
            }}
        >
            <MapCustomEvents />
            <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {markerPosition && <Marker position={markerPosition} />}

            {/* TO-DO: Přidat button pro propsání polohy do formuláře a pokračovat v procesu */}
        </MapContainer>
    );
};

export default Mapa;
