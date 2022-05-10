import React, { FunctionComponent, useEffect } from 'react';
import { Marker, TileLayer, useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import dayjs from 'dayjs';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from 'screens/NovyNalez/constants';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import { SyringeReadModel } from 'screens/Nalezy/types/SyringeReadModel';
import { Loader } from 'utils/Loader';
import pin from 'screens/Nalezy/Components/utils/pin';
import Loading from 'screens/Nalezy/Components/Loading';
import PreviewSyringeState from 'screens/Nalezy/Components/SyringeState';
import Links from 'screens/Nalezy/Components/Links';
import LeafletMap from 'screens/Nalezy/Components/LeafletMap';
import { PinMenu, Info, Location, Time, State } from 'screens/Nalezy/Components/PinMenu';

import 'leaflet/dist/leaflet.css';


interface MapProps {
    loader: Loader<SyringeReadModel>;
}

const Map: FunctionComponent<MapProps> = ({ loader }) => {
    const loading = loader.resp === undefined && loader.err === undefined;
    const error = loader.resp === undefined && loader.err !== undefined;
    const data = loader.resp?.syringeList || [];

    useEffect(() => {
        if (!error) return;

        alert('Nastala chyba při načítání seznamu nálezů.');
    }, [error]);

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
                    const icon = pin(item);
                    const [lat, lng] = coordinates;
                    return (
                        <Marker key={`${lat}-${lng}-${i}`} position={coordinates} icon={icon}>
                            <PinMenu closeButton={false} minWidth={220}>
                                <Info>
                                    <Location>{item.location.obec}</Location>
                                    <Time>{dayjs(item.createdAt * 1000).format('D. M. YYYY')}</Time>
                                    <State>
                                        <PreviewSyringeState syringe={item} />
                                    </State>
                                </Info>
                                <Links syringe={item} />
                            </PinMenu>
                        </Marker>
                    );
                })}
            </>
        );
    };

    return (
        <>
            {loading && <Loading />}
            <LeafletMap preferCanvas center={DEFAULT_POSITION} zoom={DEFAULT_ZOOM_LEVEL}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Bounds />
                <Markers />
            </LeafletMap>
        </>
    );
};

export default Map;
