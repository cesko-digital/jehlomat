import {useMap} from "react-leaflet";
import {useEffect} from "react";


export interface IChangeViewProps {
    center: [number, number];
    zoom?: number;
    callback?: () => void;

}

export const ChangeView: React.FC<IChangeViewProps> = ({ center, zoom, callback }) => {
    const map = useMap();
    const actualZoom = map.getZoom()
    map.setView(center, zoom || actualZoom);

    useEffect(() => {
        callback && callback();
    }, [])

    return null;
}
