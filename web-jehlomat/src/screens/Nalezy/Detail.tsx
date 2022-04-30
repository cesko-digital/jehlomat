import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { TileLayer } from 'react-leaflet';
import { Alert, Box, Container } from '@mui/material';
import { styled } from '@mui/system';
import Page from 'screens/Nalezy/Components/Page';
import { Header } from 'Components/Header/Header';
import TwoColumns from 'Components/Layout/TwoColumns';
import TextInput from 'Components/Inputs/TextInput';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import TextHeader from 'screens/Nalezy/Components/TextHeader';
import RoundButton from 'screens/Nalezy/Components/RoundButton';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from 'screens/NovyNalez/constants';
import LeafletMap from 'screens/Nalezy/Components/LeafletMap';
import { Loader } from 'screens/Nalezy/types/Loader';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import { isStatusSuccess } from 'utils/payload-status';
import Loading from 'screens/Nalezy/Components/Loading';
import Pin from 'screens/Nalezy/Components/Pin';
import API from 'config/baseURL';
import apiURL from 'utils/api-url';

import { ReactComponent as BackIcon } from 'assets/icons/chevron-left.svg';
import { mock } from './__mock';
import { Info, Location, PinMenu, State, Time } from './Components/PinMenu';
import dayjs from 'dayjs';
import PreviewSyringeState from './Components/SyringeState';
import Links from './Components/Links';

const Details = styled('div')(({ theme }) => ({
    marginLeft: theme.spacing(2),

    '& > *': {
        marginBottom: theme.spacing(2),
    },
}));

const state = (syringe: Syringe | undefined): string => {
    if (!syringe) return '';
    if (syringe.demolishedAt && syringe.demolished) return 'Zlikvidováno';
    if (syringe.reservedTill) return 'Rezervováno TP';

    return 'Čeká na likvidaci';
};

const Detail = () => {
    const [loader, setLoader] = useState<Loader<Syringe>>({});

    const history = useHistory();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        API.get<Syringe>(apiURL.readSyringeDetails(id)).then(
            resp => {
                if (!isStatusSuccess(resp.status)) {
                    setLoader({ err: 'Unable load details' });
                    return;
                }

                // setLoader({ resp: mock.syringeList[1] });
                setLoader({ resp: resp.data });
            },
            () => setLoader({ err: 'Unable load details' }),
        );
    }, [id]);

    const handleGetBack = useCallback(() => {
        history.push('/nalezy');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loading = loader.resp === undefined && loader.err === undefined;
    const error = loader.resp === undefined && loader.err !== undefined;
    const data: Syringe | undefined = loader.resp;

    const foundAt = data?.createdAt ? new Date(data?.createdAt).toLocaleDateString() : '';

    return (
        <>
            <Header mobileTitle="Detail nálezu" />

            <Page>
                <Container sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Box mt={5} mb={2}>
                        <TextHeader>Detail nálezu</TextHeader>
                        <RoundButton filled={true} onClick={handleGetBack}>
                            <BackIcon />
                        </RoundButton>
                    </Box>
                    {loading && (
                        <Box ml={5} mr={3}>
                            <Loading />
                        </Box>
                    )}
                    {(data || error) && (
                        <TwoColumns
                            left={
                                <Details>
                                    {error && (
                                        <Box>
                                            <Alert severity="error">Zadaný nález nebyl nalezen</Alert>
                                        </Box>
                                    )}
                                    <TextInput label="Počet jehel" value={data?.count} disabled />
                                    <TextInput label="Datum a čas nálezu" value={foundAt} disabled />
                                    <TextInput label="Místo nálezu" value={data?.location?.obec} disabled />
                                    <TextInput label="Poznámka" value={data?.note} disabled />
                                    <TextInput label="Stav nálezu" value={state(data)} disabled />
                                    <Box display="flex" alignItems="center" flexDirection="column" py={2}>
                                        <SecondaryButton onClick={handleGetBack} text="Zpět na seznam" />
                                    </Box>
                                </Details>
                            }
                            right={
                                <Box height={443} borderRadius={2} overflow="hidden">
                                    <LeafletMap preferCanvas center={DEFAULT_POSITION} zoom={DEFAULT_ZOOM_LEVEL}>
                                        {data && (
                                            <Pin syringe={data}>
                                                <PinMenu closeButton={false} minWidth={220}>
                                                    <Info>
                                                        <Location>{data.location.obec}</Location>
                                                        <Time>{dayjs(data.createdAt * 1000).format('D. M. YYYY')}</Time>
                                                        <State>
                                                            <PreviewSyringeState syringe={data} />
                                                        </State>
                                                    </Info>
                                                    <Links syringe={data} />
                                                </PinMenu>
                                            </Pin>
                                        )}
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                    </LeafletMap>
                                </Box>
                            }
                        />
                    )}
                </Container>
            </Page>
        </>
    );
};

export default Detail;
