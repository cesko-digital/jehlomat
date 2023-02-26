import styled from '@emotion/styled';
import { Container, Grid, Typography, useMediaQuery } from '@mui/material';
import { Header } from 'Components/Header/Header';
import { useState, useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import { AccessDenied } from 'screens/Organizace/403';
import { OrganisationNotFound } from 'screens/Organizace/404';
import { IData, TErrorCallback, useOrganisation } from 'screens/Organizace/use-organisation';
import { tokenState } from 'store/login';
import { primaryDark } from 'utils/colors';
import { media } from 'utils/media';
import { GeneralInformation } from './GeneralInformation';
import MapaPusobeni from './MapaPusobeni';
import { Team } from './Team';
import Modal from 'Components/Modal/Modal';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
interface IRouteParams {
    orgId?: string;
}

const Wrapper = styled(Container)`
    .offset-right {
        padding-right: 5rem;
    }
`;

const Title = styled(Typography)`
    color: ${primaryDark};
    font-size: 24px;
    line-height: 28px;
    margin: 62px 0 72px;
`;

const MapWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const ShowMapButtonWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
`;

const MapaPusobeniWrapper = styled.div`
    margin-top: -94px;

    .leaflet-container {
        border-radius: 0 !important;
    }
`;

const Organizace = () => {
    const [notFound, setNotFound] = useState(false);
    const [noPermission, setNoPermission] = useState(false);
    const [data, setData] = useState<IData>();
    const [showModal, setShowModal] = useState(false);

    const token = useRecoilValue(tokenState);
    const history = useHistory();
    const { orgId } = useParams<IRouteParams>();
    const isDesktop = useMediaQuery(media.gt('mobile'));

    const hideModal = useCallback(() => {
        setShowModal(false);
    }, []);

    const handleError: TErrorCallback = useCallback(
        errorType => {
            if (errorType === 'not-found') {
                setNotFound(true);
            } else if (errorType === 'not-admin') {
                setNoPermission(true);
            } else {
                history.push('/error');
            }
        },
        [history],
    );

    const getOrganisation = useOrganisation(handleError);

    useEffect(() => {
        async function fetchMyAPI() {
            if (token) {
                const newData = await getOrganisation(orgId);
                if (newData) {
                    setData(newData);
                }
            } else {
                setNoPermission(true);
            }
        }
        fetchMyAPI();
    }, [getOrganisation, orgId, token]);

    if (notFound) {
        return <OrganisationNotFound />;
    }

    if (noPermission) {
        return <AccessDenied />;
    }

    return (
        <>
            <Header loginButton mobileTitle={data?.user.organizationId.toString() === orgId ? 'Moje organizace' : 'Detail organizace'} />
            <Wrapper
                maxWidth="lg"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                }}
            >
                <Grid xs={12} item alignItems="center" container>
                    <Title variant="h1">{data?.user.organizationId.toString() === orgId ? 'Moje organizace' : 'Detail organizace'}</Title>
                </Grid>
                <Grid xs={isDesktop ? 6 : 12} item alignItems="center" container className={isDesktop ? 'offset-right' : ''}>
                    {data ? (
                        <>
                            <GeneralInformation data={data} />
                            {data.teams && (
                                <>
                                    <Team data={data} />
                                    {!isDesktop && (
                                        <ShowMapButtonWrapper>
                                            <SecondaryButton
                                                id="submit"
                                                text="Zobrazit na mapě"
                                                type="button"
                                                onClick={() => {
                                                    setShowModal(true);
                                                }}
                                            />
                                        </ShowMapButtonWrapper>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <div />
                    )}
                </Grid>
                {data?.teams && isDesktop && (
                    <Grid xs={6} item alignItems="start" container>
                        <MapWrapper>
                            <p>Mapa působení organizace</p>
                            <MapaPusobeni data={data?.teams} />
                        </MapWrapper>
                    </Grid>
                )}
                {data?.teams && !isDesktop && (
                    <Modal modalHeaderText={'Mapa působení organizace'} open={showModal} onClose={hideModal}>
                        <MapaPusobeniWrapper>
                            <MapaPusobeni data={data?.teams} />
                        </MapaPusobeniWrapper>
                    </Modal>
                )}
            </Wrapper>
        </>
    );
};

export default Organizace;
