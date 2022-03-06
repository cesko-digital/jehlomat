import L, { LatLngExpression } from 'leaflet';
import Box from '@mui/material/Box';
import { FC, Fragment, useEffect, useState, Dispatch, SetStateAction } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents, ZoomControl } from 'react-leaflet';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from '../constants';

const FloatinButtonContainer = styled.div`
    position: absolute;
    bottom: calc(5vh + 86px);
    left: calc(50vw - 87px);
    z-index: 5;
`;

// Leaflet hack to make it works
// @ts-ignore
import icon from '../../assets/images/marker_orange.svg';
import 'leaflet/dist/leaflet.css';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import styled from 'styled-components';
import { INovaJehla, StepsEnum } from '../NovyNalezContainer';
import MapControl from './MapControl';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: '',
    iconSize: [60, 60],
    iconAnchor: [30, 60]
});
L.Marker.prototype.options.icon = DefaultIcon;
// ------------

interface IMapa {
    userPosition: LatLngExpression | null;
    handleStepChange: (newStep: StepsEnum, newInfo?: Partial<INovaJehla>) => void;
    width: number;
    height: number;
    setUserPosition: Dispatch<SetStateAction<LatLngExpression | null>>
}

const Mapa: FC<IMapa> = ({ userPosition, handleStepChange, width, height, setUserPosition }) => {
    const [position, setPosition] = useState<LatLngExpression | null>(null);

    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);

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

    const convertPositionToInfo = () => {
        if (markerPosition != null) {
            const [lat, lng] = markerPosition.toString().split(',');
            return { lat: Number(lat), lng: Number(lng) };
        }
        return { lat: undefined, lng: undefined };
    };

    if (userPosition && !position) {
        return null;
    }


    return (
        <Box position="relative">
            <MapContainer
                center={!userPosition ? DEFAULT_POSITION : (position || {lat: 50.082476, lng: 14.4305313})}
                zoom={DEFAULT_ZOOM_LEVEL}
                scrollWheelZoom={false}
                style={{ width: `${width}px`, height: `${height}px`, zIndex: 1 }}
                preferCanvas
                whenCreated={map => {
                    handleMapCenterChange(map, setMarkerPosition);
                }}
                zoomControl={false}
            >
                <MapControl setUserPosition={setUserPosition} />
                <MapCustomEvents />
                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {markerPosition && <Marker position={markerPosition} />}
                <ZoomControl position="bottomright" />
            </MapContainer>
            <FloatinButtonContainer>
                <PrimaryButton text="Vložit místo" onClick={() => handleStepChange(StepsEnum.Info, convertPositionToInfo())} />
            </FloatinButtonContainer>
        </Box>
    );
};

export default Mapa;
