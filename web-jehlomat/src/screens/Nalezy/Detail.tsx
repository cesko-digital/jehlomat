import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import Page from 'screens/Nalezy/Components/Page';
import { Header } from 'Components/Header/Header';
import TwoColumns from 'Components/Layout/TwoColumns';
import TextHeader from './Components/TextHeader';
import { ReactComponent as BackIcon } from 'assets/icons/chevron-left.svg';
import RoundButton from './Components/RoundButton';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from '../NovyNalez/constants';
import { MapContainer, TileLayer } from 'react-leaflet';
import LeafletMap from 'screens/Nalezy/Components/LeafletMap';

import 'leaflet/dist/leaflet.css';
import { styled } from '@mui/system';

const PageContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
});

const Detail = () => {
    return (
        <>
            <Header mobileTitle="Detail nálezu" />

            <Page>
                <Container sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Box mt={5} mb={2}>
                        <TextHeader>Detail nálezu</TextHeader>
                        <RoundButton filled={true} onClick={() => alert('back')}>
                            <BackIcon />
                        </RoundButton>
                    </Box>
                    {/*<div style={{height:'100%', background:'red', display:'flex', flexGrow:1}}>*/}
                    {/*    jello.*/}
                    {/*</div>*/}
                    <TwoColumns
                        left={<span>details</span>}
                        right={
                            <LeafletMap preferCanvas center={DEFAULT_POSITION} zoom={DEFAULT_ZOOM_LEVEL}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </LeafletMap>
                        }
                    />
                </Container>
            </Page>
        </>
    );
};

export default Detail;
