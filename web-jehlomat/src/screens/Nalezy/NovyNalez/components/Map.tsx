import L, { LatLngExpression } from 'leaflet';
import Box from '@mui/material/Box';
import React, { FC, useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from 'screens/Nalezy/NovyNalez/constants';
import icon from 'assets/icons/marker_orange.svg';
import 'leaflet/dist/leaflet.css';

import { mapPositionState, mapUserPositionState, } from 'screens/Nalezy/NovyNalez/components/store';
import { ChangeView } from 'screens/Nalezy/NovyNalez/components/ChangeView';
import { useRecoilState, useSetRecoilState } from 'recoil';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: '',
    iconSize: [60, 60],
    iconAnchor: [30, 60],
});
L.Marker.prototype.options.icon = DefaultIcon;
// ------------

interface IMapa {
    locked?: boolean;
}

const Map: FC<IMapa> = ({ children, locked }) => {
    const [userPosition, setUserPosition] = useRecoilState(mapUserPositionState);
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);
    const [position, setPosition] = useRecoilState(mapPositionState);


    useEffect(() => {
        if (userPosition) {
            setMarkerPosition(userPosition);
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
        setMarkerPosition([lat, lng]);
        setPosition([lat, lng]);
    }


    return (
        <Box position="relative" width="100%" height="100%">
            <MapContainer
                center={position || userPosition || DEFAULT_POSITION}
                zoom={DEFAULT_ZOOM_LEVEL}
                scrollWheelZoom={false}
                style={{ width: `100%`, height: `95%`, zIndex: 1 }}
                whenCreated={map => {
                    handleMapCenterChange(map, setMarkerPosition);
                }}
                zoomControl={locked !== undefined ? !locked : false}
                dragging={!locked}
                doubleClickZoom={!locked}
                attributionControl={!locked}
                preferCanvas
            >
                <MapCustomEvents />
                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  />
                {markerPosition && <Marker position={markerPosition} />}
                {userPosition && <ChangeView center={userPosition} callback={() => setUserPosition(null)} />}
                <RealPositionContextProvider />
                <ZoomControl position="bottomright" />
            </MapContainer>
            {children}
        </Box>
    );
};

const RealPositionContextProvider: FC = () => {
    const map = useMap();
    const center = map.getCenter();
    const setPosition = useSetRecoilState(mapPositionState);

    // setPosition(center);

    return null;
};

export default Map;
