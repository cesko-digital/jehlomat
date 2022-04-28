import React, { FunctionComponent, useEffect } from 'react';
import { Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import { styled } from '@mui/system';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from 'screens/NovyNalez/constants';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import { SyringeReadModel } from 'screens/Nalezy/types/SyringeReadModel';
import { SyringeState } from 'screens/Nalezy/types/SyringeState';
import { Loader } from 'screens/Nalezy/types/Loader';
import Loading from 'screens/Nalezy/Components/Loading';
import PreviewSyringeState from 'screens/Nalezy/Components/SyringeState';
import Links from 'screens/Nalezy/Components/Links';
import LeafletMap from 'screens/Nalezy/Components/LeafletMap';

import 'leaflet/dist/leaflet.css';

import dayjs from 'dayjs';
import pin from './utils/pin';

interface MapProps {
    loader: Loader<SyringeReadModel>;
    onUpdate: () => void;
}

const PopupMenu = styled(Popup)({
    '& > .leaflet-popup-content-wrapper': {
        overflow: 'hidden',
        padding: 0,
    },

    '& > .leaflet-popup-content-wrapper > .leaflet-popup-content': {
        margin: 0,
        overflow: 'hidden',
    },
});

const Info = styled('div')({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '24px 24px',
    background: 'rgba(47, 166, 154, 0.1)',
});

const Location = styled('div')({
    alignSelf: 'end',
    gridColumn: '1',
    gridRow: '1',
    justifySelf: 'start',
    padding: '0 8px',
});

const Time = styled('div')({
    alignSelf: 'end',
    gridColumn: '2',
    gridRow: '1',
    justifySelf: 'end',
    padding: '0 8px',
});

const State = styled('div')({
    alignSelf: 'center',
    gridColumn: '1 / span 2',
    gridRow: '2',
    justifySelf: 'start',
    padding: '0 8px',
});

const Map: FunctionComponent<MapProps> = ({ loader, onUpdate }) => {
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
                            <PopupMenu closeButton={false} minWidth={220}>
                                <Info>
                                    <Location>{item.location.obec}</Location>
                                    <Time>{dayjs(item.createdAt * 1000).format('D. M. YYYY')}</Time>
                                    <State>
                                        <PreviewSyringeState syringe={item} />
                                    </State>
                                </Info>
                                <Links syringe={item} onUpdate={onUpdate} />
                            </PopupMenu>
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
