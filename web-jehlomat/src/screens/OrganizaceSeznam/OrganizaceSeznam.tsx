import { FC, useEffect, useState } from 'react';
import SearchInput from '../../Components/Inputs/SearchInput/SearchInput';
import { Header } from '../../Components/Header/Header';
import { Container, Box, useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
import { LayoutWrapper, ListWrapper, PageHeader } from './styled';
import { useRecoilValue } from 'recoil';
import { userState } from 'store/user';
import { AccessDenied } from 'screens/Organizace/403';
import { IOrganizace } from 'types';
import { useHistory } from 'react-router';
import API from 'config/baseURL';
import apiURL from 'utils/api-url';
import { AxiosResponse } from 'axios';
import { LINKS } from 'routes';
import Organizace from './Organizace';

const OrganizaceSeznam: FC = () => {
    const history = useHistory();
    const loggedUser = useRecoilValue(userState);
    const isMobile = useMediaQuery(media.lte('mobile'));

    const [organizations, setOrganizations] = useState<IOrganizace[]>([]);
    const [filteredOrganizations, setFilteredOrganizations] = useState<IOrganizace[]>([]);

    useEffect(() => {
        const loadData = async () => {
            if (loggedUser?.isSuperAdmin) {
                try {
                    const userResponse: AxiosResponse<IOrganizace[]> = await API.get(apiURL.getOrganizationList());
                    setOrganizations(userResponse.data);
                    setFilteredOrganizations(userResponse.data);
                } catch (err) {
                    history.push(LINKS.ERROR);
                }
            }
        };
        loadData();
    }, [history, loggedUser?.isSuperAdmin]);

    const filterUsers = (e: any) => {
        if (!e.target.value) {
            setFilteredOrganizations(organizations);
            return;
        }
        setFilteredOrganizations(organizations?.filter(item => item?.name?.toLocaleLowerCase().includes(e.target.value.toLowerCase())));
    };

    if (loggedUser && !loggedUser?.isSuperAdmin) {
        return <AccessDenied />;
    }

    return (
        <>
            <Header mobileTitle="Organizace" />
            <LayoutWrapper>
                <Container>
                    <Box mt={5} mb={2} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                        {!isMobile && <PageHeader>Seznam organizací</PageHeader>}
                        <SearchInput onChange={filterUsers} placeholder="Hledat" />
                    </Box>
                </Container>
                <Container>
                    <ListWrapper>
                        <Organizace organizations={filteredOrganizations} />
                    </ListWrapper>
                </Container>
            </LayoutWrapper>
        </>
    );
};

export default OrganizaceSeznam;
