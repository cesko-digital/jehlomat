import { FunctionComponent, useEffect, useState } from 'react';
import { Marker, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import dayjs from 'dayjs';
import gpsParser from 'utils/gpsParser';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from 'screens/Nalezy/NovyNalez/constants';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import { SyringeReadModel } from 'screens/Nalezy/types/SyringeReadModel';
import { Loader } from 'utils/Loader';
import pin from 'screens/Nalezy/Components/utils/pin';
import Loading from 'screens/Nalezy/Components/Loading';
import PreviewSyringeState from 'screens/Nalezy/Components/SyringeState';
import Links from 'screens/Nalezy/Components/Links';
import LeafletMap from 'screens/Nalezy/Components/LeafletMap';
import { PinMenu, Info, Location, Time, State } from 'screens/Nalezy/Components/PinMenu';
import styled from '@emotion/styled';
import RoundButton from 'Components/Buttons/RoundButton/RoundButton';
import filterIcon from 'assets/icons/filter.svg';
import downloadIcon from 'assets/icons/download.svg';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
import FilterMobile from './FilterMobile';

import 'leaflet/dist/leaflet.css';

const MapControlsWrapper = styled.div`
    position: absolute;
    top: 1em;
    left: 1em;
    z-index: 1000;
    display: flex;
    flex-direction: column;

    button {
        margin-bottom: 1em;
    }
`;
interface MapProps {
    loader: Loader<SyringeReadModel>;
    onExport: () => void;
}

const Map: FunctionComponent<MapProps> = ({ loader, onExport }) => {
    const loading = loader.resp === undefined && loader.err === undefined;
    const error = loader.resp === undefined && loader.err !== undefined;
    const data = loader.resp?.syringeList || [];
    const isMobile = useMediaQuery(media.lte('mobile'));
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        if (!error) return;

        alert('Nastala chyba při načítání seznamu nálezů.');
    }, [error]);

    const coordinates = data.map((item: Syringe) => gpsParser(item.gps_coordinates));
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
                    if (!icon) return null;

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
            <LeafletMap preferCanvas center={DEFAULT_POSITION} zoom={DEFAULT_ZOOM_LEVEL} zoomControl={false}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Bounds />
                <Markers />
                {isMobile && (
                    <MapControlsWrapper>
                        <RoundButton onClick={() => setShowFilter(true)}>
                            <img src={filterIcon} alt="filtrovat" />
                        </RoundButton>
                        <RoundButton onClick={onExport}>
                            <img src={downloadIcon} alt="stáhnout" />
                        </RoundButton>
                    </MapControlsWrapper>
                )}
                <ZoomControl position="topright" />
            </LeafletMap>
            {showFilter && <FilterMobile onClose={() => setShowFilter(false)} />}
        </>
    );
};

export default Map;
