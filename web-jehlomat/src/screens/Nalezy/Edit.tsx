import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { TileLayer } from 'react-leaflet';
import dayjs from 'dayjs';
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
import { Loader } from 'utils/Loader';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import { isStatusSuccess } from 'utils/payload-status';
import Loading from 'screens/Nalezy/Components/Loading';
import Pin from 'screens/Nalezy/Components/Pin';
import PreviewSyringeState from 'screens/Nalezy//Components/SyringeState';
import Links from 'screens/Nalezy/Components/Links';
import texts from 'screens/Nalezy/texts';
import { Info, Location, PinMenu, State, Time } from 'screens/Nalezy/Components/PinMenu';
import API from 'config/baseURL';
import apiURL from 'utils/api-url';

import { ReactComponent as BackIcon } from 'assets/icons/chevron-left.svg';
import NovyNalezContainer from 'screens/NovyNalez/NovyNalezContainer';
import { useRecoilState } from 'recoil';
import {newSyringeInfoState, newSyringeStepState} from 'screens/NovyNalez/components/store';

const Details = styled('div')(({ theme }) => ({
    marginLeft: theme.spacing(2),

    '& > *': {
        marginBottom: theme.spacing(2),
    },
}));

const Edit = () => {
    const [loader, setLoader] = useState<Loader<Syringe>>({});
    const [newSyringeInfo, setNewSyringeInfo] = useRecoilState(newSyringeInfoState);
    const [currentStep, setCurrentStep] = useRecoilState(newSyringeStepState);

    const history = useHistory();
    const { id } = useParams<{ id: string }>();

    const load = useCallback(() => {
        API.get<Syringe>(apiURL.readSyringeDetails(id)).then(
            resp => {
                if (!isStatusSuccess(resp.status)) {
                    setLoader({ err: 'Unable load details' });
                    return;
                }
                const { data } = resp;
                const { gps_coordinates, note, createdAt,photo } = data;
                const [lng, lat] = gps_coordinates.split(' ').map(val => parseFloat(val));

                setNewSyringeInfo({ ...data, lat, lng, info: note, datetime: createdAt, photo: photo || '', edit: true });
                setLoader({ resp: data });
            },
            () => setLoader({ err: 'Unable load details' }),
        );
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        setCurrentStep(1)
    }, [id])

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
            {loading && (
                <Box ml={5} mr={3}>
                    <Loading />
                </Box>
            )}
            {!loading && <NovyNalezContainer edit />}
        </>
    );
};

export default Edit;
