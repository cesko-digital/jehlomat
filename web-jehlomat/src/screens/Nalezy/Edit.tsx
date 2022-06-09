import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {Alert, Box} from '@mui/material';
import { Loader } from 'utils/Loader';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import { isStatusSuccess } from 'utils/payload-status';
import Loading from 'screens/Nalezy/Components/Loading';
import API from 'config/baseURL';
import apiURL from 'utils/api-url';
import { H1 } from 'utils/typography';

import NovyNalezContainer from 'screens/NovyNalez/NovyNalezContainer';
import { useRecoilState } from 'recoil';
import {newSyringeInfoState, newSyringeStepState} from 'screens/NovyNalez/components/store';
import texts from "screens/Nalezy/texts";
import Link from "Components/Link";
import {LINKS} from "routes";
import RoundButton from "screens/Nalezy/Components/RoundButton";
import {ReactComponent as BackIcon} from "assets/icons/chevron-left.svg";


const Edit = () => {
    const [loader, setLoader] = useState<Loader<Syringe>>({});
    const [, setNewSyringeInfo] = useRecoilState(newSyringeInfoState);
    const [, setCurrentStep] = useRecoilState(newSyringeStepState);

    const history = useHistory();
    const { id } = useParams<{ id: string }>();

    const load = useCallback(() => {
        API.get<Syringe>(apiURL.readSyringeDetails(id)).then(
            resp => {
                console.log({resp})
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
        ).catch(e => {
            console.log('asd not loaded', e)
        });
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
            {!loading && !error && <NovyNalezContainer edit />}
            {error && (
                <Box>
                    <Alert severity="error">{texts.DETAIL__NOT_FOUND}.
                        <Box ml={2} display="inline-block"><Link to={LINKS.FINDINGS}>Zpět.</Link></Box>
                    </Alert>
                </Box>
            )}
        </>
    );
};

export default Edit;
