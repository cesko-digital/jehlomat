import styled from '@emotion/styled';
import { Box, Container as MUIContainer, Typography } from '@mui/material';
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

const PAGE_TITLE = 'Úprava organizace';

const OrganizationEdit = () => {
    const [notFound, setNotFound] = useState(false);
    const [noPermission, setNoPermission] = useState(false);
    const [data, setData] = useState<IData>();
    const token = useRecoilValue(tokenState);
    const history = useHistory();
    const { orgId } = useParams<IRouteParams>();

    const handleError: TErrorCallback = useCallback((errorType) => {
        if (errorType === "not-found") {
            setNotFound(true);
        } else if (errorType === "not-admin") {
            setNoPermission(true);
        } else {
            history.push('/error');
        }
    }, [history]);

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
    }, []);
    
    if (notFound) {
        return <OrganisationNotFound/>
    }

    if (noPermission) {
        return <AccessDenied/>
    }

    return (
        <>
            <Header mobileTitle="" />
            <Wrapper>
                <Title variant="h1">{PAGE_TITLE}</Title>
                <Box alignItems="flex-start" gap={[0, 10, 20]} flexDirection={['column', 'row']} display="flex">
                    {data ? (
                        <>
                            <GeneralInformation data={data} />
                            <Password data={data} />
                        </>
                    ) : null}
                </Box>
            </Wrapper>
        </>
    );
};

export default OrganizationEdit;
