import React, { FunctionComponent } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import pin from 'screens/Nalezy/Components/utils/pin';
import gpsParser from 'utils/gpsParser';

interface PinProps {
    syringe: Syringe;
}

const Pin: FunctionComponent<PinProps> = ({ syringe, children }) => {
    const map = useMap();

    if (!syringe.gps_coordinates) {
        return null;
    }

    const icon = pin(syringe);
    if (!icon) {
        return null;
    }

    const coordinates = gpsParser(syringe.gps_coordinates);

    map.flyTo(coordinates);
    return (
        <Marker position={coordinates} icon={icon}>
            {children}
        </Marker>
    );
};

export default Pin;
