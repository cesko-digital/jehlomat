import { Container, Box, useMediaQuery, styled } from '@mui/material';
import { Header } from 'Components/Header/Header';
import { PageHeading } from './styled';
import { useEffect, useState } from 'react';
import { media } from 'utils/media';
import { primaryDark } from 'utils/colors';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import Modal from 'Components/Modal/Modal';
import Masonry from '@mui/lab/Masonry';
import { tokenState, userIDState } from 'store/login';
import { IOrganizace, IUser } from 'types';
import { useRecoilValue } from 'recoil';
import { AxiosResponse } from 'axios';
import { useHistory } from 'react-router';
import { LINKS } from 'routes';
import API from 'config/baseURL';
import apiURL from 'utils/api-url';
import Loading from 'screens/Nalezy/Components/Loading';
import GeneralInformation from './GeneralInformation';
import Password from './Password';
import { userState } from 'store/user';

export const Wrapper = styled(Container)`
    flex-grow: 1;
    margin-bottom: 62px;
`;

const Profile: React.FC = () => {
    const token = useRecoilValue(tokenState);
    const userId = useRecoilValue(userIDState);
    const isDesktop = useMediaQuery(media.gt('mobile'));
    const history = useHistory();
    const [user, setUser] = useState<IUser>();
    const [organization, setOrganization] = useState<IOrganizace>();
    const [successOpen, setSuccessOpen] = useState(false);
    const loggedUser = useRecoilValue(userState);

    useEffect(() => {
        if (token && userId) {
            const loadData = async (token: string) => {
                try {
                    if (!userId) throw new Error();
                    const userResponse: AxiosResponse<IUser> = await API.get(apiURL.getUser(userId));
                    setUser(userResponse.data);
                    if (userResponse.data.organizationId) {
                        const organizationInfo: AxiosResponse<IOrganizace> = await API.get(apiURL.getOrganization(userResponse.data.organizationId));
                        setOrganization(organizationInfo.data);
                    } else {
                        throw new Error();
                    }
                } catch (err) {
                    history.push(LINKS.ERROR);
                }
            };
            loadData(token);
        }
    }, [history, token, userId]);

    if (!user) {
        return <Loading />;
    }

    return (
        <>
            <Header loginButton mobileTitle={loggedUser?.isAdmin ? 'Profil organizace' : 'Profil uživatele'} />
            <Container
                maxWidth="lg"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
            >
                <Modal modalHeaderText="Editace uživatele" open={successOpen} onClose={() => setSuccessOpen(false)}>
                    <Box display="flex" flexDirection="column" justifyContent="center">
                        <Box mb={5} mx={5}>
                            Vaše změny byly uloženy.
                        </Box>
                        <Box mx="auto" mb={2}>
                            <PrimaryButton type="button" text="Pokračovat" onClick={() => setSuccessOpen(false)} />
                        </Box>
                    </Box>
                </Modal>
            </Container>
            <Wrapper>
                {isDesktop && (
                    <PageHeading align="left" variant="h1" color={primaryDark} sx={{ mt: '80px', mb: '86px', ml: '97px' }}>
                        Profil uživatele
                    </PageHeading>
                )}
                <Masonry columns={{ md: 2 }} spacing={8}>
                    <GeneralInformation user={user} organization={organization} setSuccessOpen={setSuccessOpen} />
                    <Password user={user} />
                </Masonry>
            </Wrapper>
        </>
    );
};

export default Profile;
