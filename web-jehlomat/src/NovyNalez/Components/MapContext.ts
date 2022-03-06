import {createContext} from "react";
import { LatLngExpression } from 'leaflet';

export interface IMapContext {
    position: LatLngExpression | null;
    setPosition: Function;
}

export const MapContext = createContext<IMapContext>({
    position: null,
    setPosition: () => {}
})
