import L, { LatLngExpression } from 'leaflet';
import { FC, Fragment, useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from '../constants';

const FloatinButtonContainer = styled.div`
    position: absolute;
    bottom: calc(5vh + 86px);
    left: calc(50vw - 87px);
    z-index: 5;
`;

// Leaflet hack to make it works
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import styled from 'styled-components';
import { INovaJehla, STEPS } from '../NovyNalez';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;
// ------------

interface IMapa {
    userPosition: LatLngExpression | null;
    handleStepChange: (newStep: STEPS, newInfo?: Partial<INovaJehla>) => void;
    width: number;
    height: number;
}

const Mapa: FC<IMapa> = ({ userPosition, handleStepChange, width, height }) => {
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

    // TO-DO: refactor
    if (userPosition === null) {
        return (
            <Fragment>
                <MapContainer
                    center={DEFAULT_POSITION}
                    zoom={DEFAULT_ZOOM_LEVEL}
                    scrollWheelZoom={false}
                    style={{ width: `${width}px`, height: `${height}px`, zIndex: 1 }}
                    preferCanvas
                    whenCreated={map => {
                        handleMapCenterChange(map, setMarkerPosition);
                    }}
                >
                    <MapCustomEvents />
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {markerPosition && <Marker position={markerPosition} />}
                </MapContainer>
                <FloatinButtonContainer>
                    <PrimaryButton text="Vložit místo" onClick={() => handleStepChange(STEPS.Info, convertPositionToInfo())} />
                </FloatinButtonContainer>
            </Fragment>
        );
    } else if (position !== null) {
        return (
            <Fragment>
                <MapContainer
                    center={position}
                    zoom={DEFAULT_ZOOM_LEVEL}
                    scrollWheelZoom={false}
                    style={{ width: `${width}px`, height: `${height}px`, zIndex: 1 }}
                    preferCanvas
                    whenCreated={map => {
                        handleMapCenterChange(map, setMarkerPosition);
                    }}
                >
                    <MapCustomEvents />
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {markerPosition && <Marker position={markerPosition} />}
                </MapContainer>
                <FloatinButtonContainer>
                    <PrimaryButton text="Vložit místo" onClick={() => handleStepChange(STEPS.Info, convertPositionToInfo())} />
                </FloatinButtonContainer>
            </Fragment>
        );
    } else {
        return null;
    }
};

export default Mapa;
