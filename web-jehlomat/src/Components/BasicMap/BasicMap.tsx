import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { media } from 'utils/media';
import { Label } from 'Components/Inputs/shared';
import Box from '@mui/material/Box';
import { MapContainer, Polygon, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from 'screens/Nalezy/NovyNalez/constants';
import API from 'config/baseURL';
import { AxiosResponse } from 'axios';
import { ILocation } from 'types';

const Map = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: 500px;
    flex-grow: 1;
    padding: 1em;
    @media ${media.lte('mobile')} {
        // compensate parent padding, nasty but easiest
        width: 100vw;
        height: 100vh;
        padding: 0em;
    }
`;

interface BasicMapProps {
    display?: boolean;
    borderRadius?: number;
    location: ILocation[];
}

const BasicMap: React.FC<BasicMapProps> = ({ display = true, borderRadius = 0, location }) => {
    const [geom, setGeom]: any[] = useState([]);

    const show = display ? 'block' : 'none';
    const label = display ? 'none' : 'block';

    const getGeometry = async (type: string, id: string) => {
        const response: AxiosResponse<any> = await API.get(`/location/geometry?type=${type}&id=${id}`);
        return response.data;
    };

    useEffect(() => {
        const checkType = (type: string, data: any) => {
            switch (type.toLowerCase()) {
                case 'multipolygon':
                    return data.coordinates && data.coordinates[0] && data.coordinates[0][0] ? data.coordinates[0][0] : [];
                case 'polygon':
                    return data.coordinates && data.coordinates[0] ? data.coordinates[0] : [];
            }
        };
        setGeom([]);
        location.map(async (place: any, id: number) => {
            const geometry = await getGeometry(place.type, place.id).then(data => {
                const transformGeom: any[] = [];
                //GEOMETRY TRANSFORMATION
                checkType(data.type, data).forEach((coordinate: any) => {
                    transformGeom.push([coordinate[1], coordinate[0]]);
                });
                return transformGeom;
            });
            setGeom((geom: any) => [...geom, geometry]);
        });
    }, [location]);

    function GetBoundary() {
        const map = useMap();
        if (geom.length > 0) {
            map.fitBounds(geom);
        }
        return null;
    }

    return (
        <Map id="map-container" style={{ display: show }}>
            <Label style={{ display: label }}>Oblast na mapě</Label>
            <Box position="relative" width="100%" height="100%">
                <MapContainer
                    center={DEFAULT_POSITION}
                    zoom={DEFAULT_ZOOM_LEVEL}
                    scrollWheelZoom={false}
                    style={{ width: `100%`, height: `100%`, zIndex: 1, borderRadius: borderRadius }}
                    dragging={true}
                    doubleClickZoom={true}
                    preferCanvas
                >
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {geom.map((geometry: any, id: any) => {
                        return <Polygon key={id} pathOptions={{ color: 'purple' }} positions={geometry} />;
                    })}
                    <GetBoundary />
                </MapContainer>
            </Box>
        </Map>
    );
};

export default BasicMap;
