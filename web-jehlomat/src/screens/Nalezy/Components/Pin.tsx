import React, { FunctionComponent } from 'react';
import { LatLngTuple } from 'leaflet';
import { Marker, useMap } from 'react-leaflet';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import pin from 'screens/Nalezy/Components/utils/pin';

interface PinProps {
    syringe: Syringe;
}

const Pin: FunctionComponent<PinProps> = ({ syringe, children }) => {
    const map = useMap();

    if (!syringe.gps_coordinates) {
        return null;
    }

    const [lat, lng] = syringe.gps_coordinates.split(',').map(i => i.trim());
    const coordinates: LatLngTuple = [+lat, +lng];

    map.flyTo(coordinates);
    return (
        <Marker position={coordinates} icon={pin(syringe)}>
            {children}
        </Marker>
    );
};

export default Pin;
