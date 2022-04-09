import React, { FunctionComponent } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L, { Icon, LatLngTuple } from 'leaflet';
import { styled } from '@mui/system';
import { Syringe } from '../types/Syringe';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from 'screens/NovyNalez/constants';
import { SyringeReadModel } from 'screens/Nalezy/types/SyringeReadModel';
import {SyringeState} from "screens/Nalezy/types/SyringeState";
import Links from './Links';

import 'leaflet/dist/leaflet.css';
import gray from 'assets/pins/pin-gray.svg';
import green from 'assets/pins/pin-green.svg';
import yellow from 'assets/pins/pin-yellow.svg';
import {Loader} from "../types/Loader";

interface MapProps {
    loader: Loader<SyringeReadModel>;
}

const LeafletMap = styled(MapContainer)({
    flexGrow: 1,
    outline: 'none',
});

const PopupMenu = styled(Popup)({
    '& > .leaflet-popup-content-wrapper > .leaflet-popup-content': {
        margin: 0,
    },
});

const deriveStateOf = (syringe: Syringe): SyringeState => {
    if (syringe.demolishedAt && syringe.demolished) {
        return 'DEMOLISHED';
    }

    if (syringe.reservedTill) {
        return 'RESERVED';
    }

    return 'WAITING';
};

const map: Record<SyringeState, Icon> = {
    RESERVED: L.icon({
        iconUrl: green,
        iconAnchor: [30, 60],
    }),
    DEMOLISHED: L.icon({
        iconUrl: gray,
        iconAnchor: [30, 60],
    }),
    WAITING: L.icon({
        iconUrl: yellow,
        iconAnchor: [30, 60],
    }),
};

const Map: FunctionComponent<MapProps> = ({ loader }) => {
    const loading = loader.resp === undefined && loader.err === undefined;
    const error = loader.resp === undefined && loader.err !== undefined;
    const loaded = loader.resp !== undefined;
    const data = loader.resp?.syringeList || [];

    const coordinates = data.map((item: Syringe) => {
        const [lat, lng] = item.gps_coordinates.split(',').map(i => i.trim());
        const coordinate: LatLngTuple = [+lat, +lng];

        return coordinate;
    });

    const Bounds = (): JSX.Element | null => {
        const map = useMap();

        if (coordinates.length === 0) {
            return null;
        }

        const bounds = new L.LatLngBounds(coordinates);
        map.fitBounds(bounds);
        return null;
    };

    const Markers = (): JSX.Element | null => {
        return (
            <>
                {coordinates.map((coordinates, i) => {
                    const item = data[i];
                    const state = deriveStateOf(item);
                    const icon = map[state];
                    const [lat, lng] = coordinates;
                    return (
                        <Marker key={`${lat}-${lng}-${i}`} position={coordinates} icon={icon}>
                            <PopupMenu closeButton={false} minWidth={180}>
                                <Links />
                            </PopupMenu>
                        </Marker>
                    );
                })}
            </>
        );
    };

    return (
        <LeafletMap preferCanvas center={DEFAULT_POSITION} zoom={DEFAULT_ZOOM_LEVEL}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Bounds />
            <Markers />
        </LeafletMap>
    );
};

export default Map;
