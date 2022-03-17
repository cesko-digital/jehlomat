import L, { LatLngExpression } from 'leaflet';
import Box from '@mui/material/Box';
import React, { FC, useEffect, useState, useContext } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents, ZoomControl } from 'react-leaflet';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from '../constants';
import icon from 'assets/icons/marker_orange.svg';
import 'leaflet/dist/leaflet.css';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import styled from '@emotion/styled';
import { INovaJehla, StepsEnum } from '../NovyNalezContainer';
import MapControl from './MapControl';
import { MapContext } from './MapContext';
import { ChangeView } from './ChangeView';

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
    handleStepChange: (newStep: StepsEnum, newInfo?: Partial<INovaJehla>) => void;
}

const Map: FC<IMapa> = ({ handleStepChange }) => {
    const { position: userPosition } = useContext(MapContext);
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
    }

    const convertPositionToInfo = () => {
        if (markerPosition != null) {
            const [lat, lng] = markerPosition.toString().split(',');
            return { lat: Number(lat), lng: Number(lng) };
        }
        return { lat: undefined, lng: undefined };
    };

    return (
        <Box position="relative" width="100%" height="100%">
            <MapControl />
            <MapContainer
                center={userPosition || DEFAULT_POSITION}
                zoom={DEFAULT_ZOOM_LEVEL}
                scrollWheelZoom={false}
                style={{ width: `100%`, height: `95%`, zIndex: 1 }}
                whenCreated={map => {
                    handleMapCenterChange(map, setMarkerPosition);
                }}
                zoomControl={false}
                preferCanvas
            >
                <MapCustomEvents />
                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {markerPosition && <Marker position={markerPosition} />}
                {changePosition && <ChangeView center={changePosition} callback={() => setChangePosition(undefined)} />}
                <ZoomControl position="bottomright" />
            </MapContainer>
            <FloatinButtonContainer>
                <PrimaryButton text="Vložit místo" onClick={() => handleStepChange(StepsEnum.Info, convertPositionToInfo())} />
            </FloatinButtonContainer>
        </Box>
    );
};

export default Map;
