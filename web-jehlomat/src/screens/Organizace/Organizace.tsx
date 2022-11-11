import styled from '@emotion/styled';
import { Container as MUIContainer, Typography } from '@mui/material';
import { Header } from 'Components/Header/Header';
import { useState, useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import { AccessDenied } from 'screens/Organizace/403';
import { OrganisationNotFound } from 'screens/Organizace/404';
import { IData, TErrorCallback, useOrganisation } from 'screens/Organizace/use-organisation';
import { tokenState } from 'store/login';
import { primaryDark } from 'utils/colors';
import { GeneralInformation } from './GeneralInformation';
import { Password } from './Password';
import { Team } from './Team';
import Masonry from '@mui/lab/Masonry';
interface IRouteParams {
    orgId?: string;
}

export const Wrapper = styled(MUIContainer)`
    flex-grow: 1;
    margin-bottom: 62px;
`;

export const Title = styled(Typography)`
    color: ${primaryDark};
    font-size: 24px;
    line-height: 28px;
    margin: 62px 0 72px;
`;

const Organizace = () => {
    const [notFound, setNotFound] = useState(false);
    const [noPermission, setNoPermission] = useState(false);
    const [data, setData] = useState<IData>();
    const token = useRecoilValue(tokenState);
    const history = useHistory();
    const { orgId } = useParams<IRouteParams>();

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
            <Wrapper>
                <Title variant="h1">{data?.user.organizationId.toString() === orgId ? 'Moje organizace' : 'Detail organizace'}</Title>
                <Masonry columns={{ md: 2 }} spacing={8}>
                    {data ? (
                        <>
                            <GeneralInformation data={data} />
                            <Password data={data} />
                            {data.teams && <Team data={data} />}
                        </>
                    ) : (
                        <div></div>
                    )}
                </Masonry>
            </Wrapper>
        </>
    );
};

export default Organizace;
