import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { TileLayer } from 'react-leaflet';
import dayjs from 'dayjs';
import { Alert, Box, Container, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import Page from 'screens/Nalezy/Components/Page';
import { Header } from 'Components/Header/Header';
import TwoColumns from 'Components/Layout/TwoColumns';
import TextInput from 'Components/Inputs/TextInput';
// import FileUpload from 'Components/Inputs/FileUpload';
import TextButton from 'Components/Buttons/TextButton/TextButton';
import TextHeader from 'screens/Nalezy/Components/TextHeader';
import RoundButton from 'screens/Nalezy/Components/RoundButton';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from 'screens/Nalezy/NovyNalez/constants';
import LeafletMap from 'screens/Nalezy/Components/LeafletMap';
import { lightGreen, lightOrange, primary, secondary } from 'utils/colors';
import { media } from 'utils/media';
import { Loader } from 'utils/Loader';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import { isStatusGeneralSuccess, isStatusSuccess } from 'utils/payload-status';
import Loading from 'screens/Nalezy/Components/Loading';
import Pin from 'screens/Nalezy/Components/Pin';
import PreviewSyringeState from 'screens/Nalezy//Components/SyringeState';
import Links from 'screens/Nalezy/Components/Links';
import texts from 'screens/Nalezy/texts';
import { Info, Location, PinMenu, State, Time } from 'screens/Nalezy/Components/PinMenu';
import API from 'config/baseURL';
import apiURL from 'utils/api-url';
import { ReactComponent as BackIcon } from 'assets/icons/chevron-left.svg';
import { IOrganizace, ITeam, SyringeStatus } from 'types';
import { AxiosResponse } from 'axios';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import { useRecoilValue } from 'recoil';
import { userState } from 'store/user';
import { LINKS } from 'routes';
import ModalPrimary from '../../Components/ModalPrimary/ModalPrimary';
import { CheckIcon } from 'assets/CheckIcon';
import Confirmation from '../../Components/Confirmation/Confirmation';

interface SyringeDetails extends Syringe {
    organization?: IOrganizace | undefined;
    team?: ITeam | undefined;
}

const Details = styled('div')`
    & > * {
        margin-bottom: ${props => props.theme.spacing(2)};
    }

    @media ${media.gt('mobile')} {
        margin-left: ${props => props.theme.spacing(2)};
    }
`;

const ConfirmationText = styled('p')`
    font-size: 1.5rem;
    font-weight: 300;
    margin: 0;
`;

const ConfirmationButton = styled('div')`
    margin-top: 6rem;
    margin-bottom: 1rem;
`;

const state = (syringe: Syringe | undefined): string => {
    if (!syringe) return '';
    if (syringe.demolishedAt && syringe.demolished) return SyringeStatus.Zlikvidovan;
    if (syringe.reservedBy) return SyringeStatus.Rezervovan;

    return SyringeStatus.CekaNaLikvitaci;
};

const getStateStyle = (syringe: Syringe | undefined): object => {
    if (!syringe || syringe.demolished) return {};
    if (syringe?.reservedBy) return { backgroundColor: lightGreen, borderRadius: '4px' };
    return { backgroundColor: lightOrange, borderRadius: '4px' };
};

const formatDate = (date: number | undefined): string => (date ? dayjs(date * 1000).format('D. M. YYYY') : '');

const Detail = () => {
    const [loader, setLoader] = useState<Loader<SyringeDetails>>({});
    const [newStatus, setNewStatus] = useState<string>('');
    const [showDestroyConfirmation, setShowDestroyConfirmation] = useState<boolean>(false);
    const loggedUser = useRecoilValue(userState);
    const isMobile = useMediaQuery(media.lte('mobile'));
    const history = useHistory();
    const { id } = useParams<{ id: string }>();

    const load = useCallback(async () => {
        let syringeDetailsResponse: AxiosResponse<Syringe> | undefined;
        try {
            syringeDetailsResponse = await API.get<Syringe>(apiURL.readSyringeDetails(id));

            if (!isStatusSuccess(syringeDetailsResponse.status)) {
                throw new Error();
            }
        } catch (error) {
            setLoader({ err: 'Unable load details' });
        }
        const orgId: number | undefined = syringeDetailsResponse?.data.createdBy?.organizationId;
        const teamId = syringeDetailsResponse?.data.createdBy?.teamId;
        let organization: AxiosResponse<IOrganizace> = { data: {} } as AxiosResponse<IOrganizace>;
        let teams: AxiosResponse<ITeam[]>;
        let team: ITeam | undefined;

        if (orgId) {
            organization = await API.get<IOrganizace>(apiURL.getOrganization(orgId));
        }
        if (teamId) {
            teams = await API.get<ITeam[]>(apiURL.getTeamsInOrganization(orgId));
            team = teams.data.find((team: ITeam) => team.id === teamId);
        }
        if (syringeDetailsResponse) {
            setLoader({ resp: { ...syringeDetailsResponse?.data, team: team, organization: { ...organization.data } } });
        }
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
            // TODO Add UI to select reservation duration, currently 1 month is used
            await API.post(`/syringe/${data.id}/reserve`, {
                reservedTill: dayjs().add(1, 'month').subtract(1, 'day').unix(),
            });
            await load();
            setNewStatus(SyringeStatus.Rezervovan);
        }
    };

    const cancelReservation = async (data: Syringe | undefined) => {
        if (!data) {
            return;
        }
        try {
            const response: AxiosResponse<any> = await API.put('/syringe', {
                id: data.id,
                createdAt: data.createdAt,
                createdById: data.createdBy?.id,
                reservedTill: null,
                reservedById: null,
                demolishedAt: data.demolishedAt,
                demolisherType: data.demolisherType,
                photo: data.photo,
                count: data.count,
                note: data.note,
                gps_coordinates: data.gps_coordinates,
                demolished: data.demolished,
                locationId: data.location.id,
            });
            if (!isStatusGeneralSuccess(response.status)) {
                throw new Error();
            }
            await load();
            setNewStatus(SyringeStatus.CekaNaLikvitaci);
        } catch (err) {
            history.push(LINKS.ERROR);
        }
    };

    const demolishSyringe = async (data: Syringe | undefined) => {
        if (!data) {
            return;
        }
        try {
            const response: AxiosResponse<any> = await API.post(`/syringe/${data.id}/demolish`);
            if (!isStatusGeneralSuccess(response.status)) {
                throw new Error();
            }
            await load();
            setNewStatus(SyringeStatus.Zlikvidovan);
            setShowDestroyConfirmation(false);
        } catch (err) {
            history.push(LINKS.ERROR);
        }
    };

    const loading = loader.resp === undefined && loader.err === undefined;
    const error = loader.resp === undefined && loader.err !== undefined;
    const data: SyringeDetails | undefined = error ? undefined : loader.resp;

    const arrayOfPict: string[] = data?.photo?.replaceAll(']', '').replaceAll('[', '').replaceAll('"', '').split(',')!;
    const filterPicOfArray = arrayOfPict?.filter(function (el) {
        return el !== 'data:image/jpeg;base64';
    });
    const DetailsCmp = (
        <Details>
            <TextInput label={texts.DETAIL__SYRINGES_COUNT} value={data?.count} disabled />
            <TextInput label={texts.DETAIL__DATETIME} value={formatDate(data?.createdAt)} disabled />
            <TextInput label={texts.DETAIL__PLACE} value={data?.location?.obec} disabled />
            <TextInput label={texts.DETAIL__NOTE} value={data?.note} disabled />
            <TextInput label={texts.DETAIL__STATE} value={state(data)} disabled inputProps={{ style: getStateStyle(data) }} />
            {data?.createdBy?.username && <TextInput label={texts.DETAIL__USER} value={data?.createdBy?.username} disabled />}
            {data?.team?.name && <TextInput label={texts.DETAIL__TEAM} value={data?.team?.name} disabled />}
            {data?.organization?.name && <TextInput label={texts.DETAIL__ORGANIZATION} value={data?.organization?.name} disabled />}

            {data?.photo?.length! > 0 && (
                <Box mt={2} width="100%">
                    <Box
                        sx={{ overflowX: 'scroll', border: '1px solid rgba(0, 0, 0, 0.23)', padding: '16px 14px', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }}
                        display="flex"
                        alignItems="flex-start"
                    >
                        {filterPicOfArray?.map((pic, index) => (
                            <Box
                                component="img"
                                src={`data:image/jpeg;base64,${pic}`}
                                width={isMobile ? 150 : 400}
                                mr={2}
                                // sx={{
                                //     transition: '.1s all',
                                //     '&:hover': { transform: 'scale(1.05)', cursor: 'pointer' },
                                // }}
                                key={index}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {(data?.reservedBy?.id === loggedUser?.id || (!data?.reservedBy?.id && !data?.demolished)) && (
                <Box display="flex" alignItems="center" flexDirection="column" py={2}>
                    <PrimaryButton text="Zlikviduji nález ihned" onClick={() => setShowDestroyConfirmation(true)} />
                </Box>
            )}

            {data && !data.demolished && !data.reservedBy && (
                <Box display="flex" alignItems="center" flexDirection="column" py={2}>
                    <TextButton color={primary} onClick={() => reserve(data)} text="Nález si rezervuji k pozdější likvidaci" textTransform="uppercase" textDecoration="underline" />
                </Box>
            )}

            {data?.reservedBy?.id && (loggedUser?.isAdmin || loggedUser?.id === data?.createdBy?.id) && (
                <Box display="flex" alignItems="center" flexDirection="column" py={2}>
                    <PrimaryButton text="Zrušit rezervaci nálezu" onClick={() => cancelReservation(data)} />
                </Box>
            )}
            <ModalPrimary open={!!newStatus} onClose={() => setNewStatus('')}>
                <span className="text">Stav nálezu na</span>
                <span className="title">jehlomat.cz</span>
                <span className="text">byl změněn na</span>
                <span className="newStatus">"{newStatus}"</span>
                <Box sx={{ width: 70, height: 70, backgroundColor: secondary, borderRadius: '100%', color: 'white' }}>
                    <CheckIcon />
                </Box>
            </ModalPrimary>

            <Confirmation open={showDestroyConfirmation}>
                <ConfirmationText>Prosím potvrďte likvidaci injekční stříkačky</ConfirmationText>
                <ConfirmationButton>
                    <PrimaryButton text="Nález je zlikvidován" onClick={() => demolishSyringe(data)} />
                </ConfirmationButton>
                <TextButton text="Zpět na nález" onClick={() => setShowDestroyConfirmation(false)} color={primary} textTransform="uppercase" fontSize={18} />
            </Confirmation>
        </Details>
    );

    const MapCmp = (
        <Box height={443} borderRadius={2} overflow="hidden">
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
                    {!isMobile && (
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
