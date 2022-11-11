import { FC, useState, useEffect } from 'react';
import SearchInput from '../../Components/Inputs/SearchInput/SearchInput';
import { primary, primaryDark } from '../../utils/colors';
import { Header } from '../../Components/Header/Header';
import { Container, Box, useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
import { LINKS, Routes } from 'routes';
import Navigator from 'Components/Navigator/Navigator';
import AddIcon from '@mui/icons-material/Add';
import { LayoutWrapper, ListWrapper, TextButton, IconButton, PageHeader } from './styled';
import { IUser } from 'types';
import { useHistory } from 'react-router';
import apiURL from 'utils/api-url';
import { AxiosResponse } from 'axios';
import API from 'config/baseURL';
import { useRecoilValue } from 'recoil';
import { userState } from 'store/user';
import { AccessDenied } from 'screens/Organizace/403';
import Uzivatele from './Uzivatele';

const SeznamUzivatelu: FC = () => {
    const history = useHistory();
    const loggedUser = useRecoilValue(userState);

    const [users, setUsers] = useState<IUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
    const isMobile = useMediaQuery(media.lte('mobile'));

    useEffect(() => {
        const loadData = async () => {
            if (loggedUser?.organizationId) {
                try {
                    const userResponse: AxiosResponse<IUser[]> = await API.get(apiURL.getUsersInOrganization(loggedUser.organizationId));
                    setUsers(userResponse.data);
                    setFilteredUsers(userResponse.data);
                } catch (err) {
                    history.push(LINKS.ERROR);
                }
            }
        };
        loadData();
    }, [history, loggedUser?.organizationId]);

    const filterUsers = (e: any) => {
        if (!e.target.value) {
            setFilteredUsers(users);
            return;
        }
        setFilteredUsers(users?.filter(item => item?.username?.toLocaleLowerCase().includes(e.target.value.toLowerCase())));
    };

    if (loggedUser && !loggedUser?.isAdmin) {
        return <AccessDenied />;
    }

    return (
        <>
            <Header loginButton mobileTitle="Uživatelé" />
            <LayoutWrapper>
                <Container>
                    <Box mt={5} mb={2} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                        {!isMobile && <PageHeader>Seznam uživatelů</PageHeader>}
                        {isMobile ? (
                            <IconButton>
                                <Navigator route={Routes.USER_NEW}>
                                    <AddIcon style={{ fill: `${primary}` }} fontSize="large" />
                                </Navigator>
                            </IconButton>
                        ) : (
                            <TextButton style={{ marginLeft: '10px', color: `${primaryDark}` }}>
                                <Navigator route={Routes.USER_NEW}>Přidat nového uživatele</Navigator>
                            </TextButton>
                        )}
                        <SearchInput onChange={filterUsers} placeholder="Hledat" />
                    </Box>
                </Container>
                <Container>
                    <ListWrapper>
                        <Uzivatele users={filteredUsers} />
                    </ListWrapper>
                </Container>
            </LayoutWrapper>
        </>
    );
};

export default SeznamUzivatelu;
