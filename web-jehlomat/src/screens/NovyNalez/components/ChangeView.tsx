import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { LatLngExpression } from 'leaflet';

export interface IChangeViewProps {
    center: LatLngExpression;
    zoom?: number;
    callback?: () => void;
}

/**
 * Change map position, weird way but seems like the way.
 * @param center
 * @param zoom
 * @param callback
 * @constructor
 */
export const ChangeView: React.FC<IChangeViewProps> = ({ center, zoom, callback }) => {
    const map = useMap();
    const actualZoom = map.getZoom();
    map.setView(center, zoom || actualZoom);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        callback && callback();
    }, []);

    return null;
};
