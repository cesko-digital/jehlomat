import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { TileLayer } from 'react-leaflet';
import dayjs from 'dayjs';
import { Alert, Box, Container, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { useRecoilValue } from 'recoil';
import Page from 'screens/Nalezy/Components/Page';
import { Header } from 'Components/Header/Header';
import TwoColumns from 'Components/Layout/TwoColumns';
import TextInput from 'Components/Inputs/TextInput';
import TextButton from 'Components/Buttons/TextButton/TextButton';
import TextHeader from 'screens/Nalezy/Components/TextHeader';
import RoundButton from 'screens/Nalezy/Components/RoundButton';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from 'screens/Nalezy/NovyNalez/constants';
import LeafletMap from 'screens/Nalezy/Components/LeafletMap';
import { primary } from 'utils/colors';
import { media } from 'utils/media';
import { Loader } from 'utils/Loader';
import { Syringe, SyringeChangeReq } from 'screens/Nalezy/types/Syringe';
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
import { userIDState } from 'store/login';

const Details = styled('div')`
    & > * {
        margin-bottom: ${props => props.theme.spacing(2)};
    }

    @media ${media.gt('mobile')} {
        margin-left: ${props => props.theme.spacing(2)};
    }
`;

const state = (syringe: Syringe | undefined): string => {
    if (!syringe) return '';
    if (syringe.demolishedAt && syringe.demolished) return 'Zlikvidováno';
    if (syringe.reservedBy) return 'Rezervováno TP';

    return 'Čeká na likvidaci';
};

const formatDate = (date: number | undefined): string => (date ? dayjs(date * 1000).format('D. M. YYYY') : '');

const Detail = () => {
    const [loader, setLoader] = useState<Loader<Syringe>>({});
    const isMobile = useMediaQuery(media.lte('mobile'));

    const history = useHistory();
    const { id } = useParams<{ id: string }>();
    const userId = useRecoilValue(userIDState);

    const load = useCallback(() => {
        API.get<Syringe>(apiURL.readSyringeDetails(id)).then(
            resp => {
                if (!isStatusSuccess(resp.status)) {
                    setLoader({ err: 'Unable load details' });
                    return;
                }

                setLoader({ resp: resp.data });
            },
            () => setLoader({ err: 'Unable load details' }),
        );
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    const handleGetBack = useCallback(() => {
        history.push('/nalezy');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reserve = async (data: Syringe | undefined) => {
        if (data) {
            // TODO replace /syringe endpoint with simplified /syringe/{ID}/reserve endpoint if available
            const changeData = {
                ...data,
                createdById: data.createdBy?.id,
                reservedById: userId,
                locationId: data.location?.id,
            };
            delete changeData.createdBy;
            // @ts-ignore
            delete changeData.location;
            delete changeData.reservedBy;
            delete changeData.demolishedBy;

            await API.put('/syringe', changeData as unknown as SyringeChangeReq);
            await load();
        }
    };

    const loading = loader.resp === undefined && loader.err === undefined;
    const error = loader.resp === undefined && loader.err !== undefined;
    const data: Syringe | undefined = error ? undefined : loader.resp;

    const DetailsCmp = (
        <Details>
            <TextInput label={texts.DETAIL__SYRINGES_COUNT} value={data?.count} disabled />
            <TextInput label={texts.DETAIL__DATETIME} value={formatDate(data?.createdAt)} disabled />
            <TextInput label={texts.DETAIL__PLACE} value={data?.location?.obec} disabled />
            <TextInput label={texts.DETAIL__NOTE} value={data?.note} disabled />
            <TextInput label={texts.DETAIL__STATE} value={state(data)} disabled />
            {data && !data.demolished && !data.reservedBy && (
                <Box display="flex" alignItems="center" flexDirection="column" py={2}>
                    <TextButton color={primary} onClick={() => reserve(data)} text="Nález si rezervuji k pozdější likvidaci" textTransform="uppercase" textDecoration="underline" />
                </Box>
            )}
        </Details>
    );

    const MapCmp = (
        <Box height={443} borderRadius={2} overflow="hidden" zIndex={0}>
            <LeafletMap preferCanvas center={DEFAULT_POSITION} zoom={DEFAULT_ZOOM_LEVEL}>
                {data && (
                    <Pin syringe={data}>
                        <PinMenu closeButton={false} minWidth={220}>
                            <Info>
                                <Location>{data.location.obec}</Location>
                                <Time>{formatDate(data.createdAt)}</Time>
                                <State>
                                    <PreviewSyringeState syringe={data} />
                                </State>
                            </Info>
                            <Links onClose={load} syringe={data} />
                        </PinMenu>
                    </Pin>
                )}
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </LeafletMap>
        </Box>
    );

    return (
        <>
            <Header mobileTitle={texts.DETAIL__TITLE} backRoute={'/nalezy'} />

            <Page>
                <Container sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    { !isMobile && (
                        <Box mt={5} mb={2}>
                            <TextHeader>{texts.DETAIL__TITLE}</TextHeader>
                            <RoundButton filled={true} onClick={handleGetBack}>
                                <BackIcon />
                            </RoundButton>
                        </Box>
                    )}
                    {loading && (
                        <Box ml={5} mr={3}>
                            <Loading />
                        </Box>
                    )}
                    {error && (
                        <Box>
                            <Alert severity="error">{texts.DETAIL__NOT_FOUND}</Alert>
                        </Box>
                    )}
                    {data && isMobile && (
                        <Box pt={4}>
                            {DetailsCmp}
                            {MapCmp}
                        </Box>
                    )}
                    {data && !isMobile && <TwoColumns left={DetailsCmp} right={MapCmp} />}
                </Container>
            </Page>
        </>
    );
};

export default Detail;
