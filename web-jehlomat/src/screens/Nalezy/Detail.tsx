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
import { styled } from '@mui/system';
import TextInput from '../../Components/Inputs/TextInput';
import PrimaryButton from "../../Components/Buttons/PrimaryButton/PrimaryButton";
import TextButton from "../../Components/Buttons/TextButton/TextButton";
import SecondaryButton from "../../Components/Buttons/SecondaryButton/SecondaryButton";

const Details = styled('div')(({ theme }) => ({
    marginLeft: theme.spacing(2),

    '& > *': {
        marginBottom: theme.spacing(2),
    }
}));

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
                        left={
                            <Details>
                                <TextInput label="Počet jehel" value="2" disabled />
                                <TextInput label="Datum a čas nálezu" value={new Date().toLocaleDateString()} disabled />
                                <TextInput label="Místo nálezu" value="Brno" disabled />
                                <TextInput label="Poznámka" value="Zlomené" disabled />
                                <TextInput label="Stav nálezu" value="Rezervováno k likvidaci TP" disabled />
                                <Box display="flex" alignItems="center" flexDirection="column" py={2}>
                                    <PrimaryButton text="Editovat nález" style={{marginBottom: '1rem'}} />
                                    <SecondaryButton text="Zpět na seznam" />
                                </Box>
                            </Details>
                        }
                        right={
                            <Box height={443} borderRadius={2} overflow="hidden">
                                <LeafletMap preferCanvas center={DEFAULT_POSITION} zoom={DEFAULT_ZOOM_LEVEL}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                </LeafletMap>
                            </Box>
                        }
                    />
                </Container>
            </Page>
        </>
    );
};

export default Detail;
