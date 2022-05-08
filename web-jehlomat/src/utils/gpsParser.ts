import { LatLngTuple } from 'leaflet';

const gpsParser = (coordinates: string): LatLngTuple => {
    const [lat, lng] = coordinates.split(' ').map(i => i.trim());

    return [+lat, +lng];
};

export default gpsParser;
