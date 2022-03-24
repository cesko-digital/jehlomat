import L, { LatLngExpression } from 'leaflet';
import Box from '@mui/material/Box';
import React, { FC, useEffect, useState, useContext } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents, ZoomControl } from 'react-leaflet';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from '../constants';
import icon from 'assets/icons/marker_orange.svg';
import 'leaflet/dist/leaflet.css';

import styled from '@emotion/styled';

import { mapPositionState, mapUserPositionState, newSyringeStepState } from './store';
import { ChangeView } from './ChangeView';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

const FloatinButtonContainer = styled.div`
    position: absolute;
    bottom: calc(5vh + 86px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
`;

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
    const userPosition = useRecoilValue(mapUserPositionState);
    const setPosition = useSetRecoilState(mapPositionState);
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);
    const [changePosition, setChangePosition] = useState<LatLngExpression>();

    useEffect(() => {
        if (userPosition) {
            setMarkerPosition(userPosition);
            setChangePosition(userPosition);
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
                center={userPosition || DEFAULT_POSITION}
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
                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {markerPosition && <Marker position={markerPosition} />}
                {changePosition && <ChangeView center={changePosition} callback={() => setChangePosition(undefined)} />}
                <ZoomControl position="bottomright" />
            </MapContainer>
            {children}
        </Box>
    );
};

export default Map;
