import { Typography, Grid, Container, useMediaQuery } from '@mui/material';
import map from '../../assets/images/map.png';
import { HeaderMobile } from '../../Components/Header/HeaderMobile';
import { Header } from '../../Components/Header/Header';
import { darkGrey, primaryDark } from '../../utils/colors';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import { media } from '../../utils/media';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { LINKS, ORGANIZATION_URL_PATH } from 'routes';
import { useRecoilValue } from 'recoil';
import { isLoginValidState } from 'store/login';
import { convertSearchStringToMap } from 'utils/url';
import { IUser } from 'types';
import { userState } from 'store/user';

function getRedirectionLink(search: string, loggedUser: IUser | null) {
    const searchMap = convertSearchStringToMap(search);
    const fromLink = searchMap.get('from');
    if (fromLink === null && loggedUser?.isSuperAdmin) {
        return LINKS.ORGANIZATIONS;
    }
    if (fromLink === null && loggedUser?.isAdmin && loggedUser?.organizationId) {
        return `${ORGANIZATION_URL_PATH}/${loggedUser.organizationId}`;
    }
    return fromLink || LINKS.NEW_FIND_INIT;
}

const LandingPage = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    const history = useHistory();
    const isLoggedIn = useRecoilValue(isLoginValidState);
    const user = useRecoilValue(userState);
    const { search } = useLocation();

    if (user) {
        const redirection = getRedirectionLink(search, user);
        return <Redirect to={redirection} />;
    } else {
        if (isMobile) {
            return <HeaderMobile />;
        }

        return (
            <>
                <Header mobileTitle="" />

                <Container
                    maxWidth="lg"
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <Grid xs={7} alignItems="start" container direction="column" justifyContent="center">
                        <Typography align="left" variant="h1" color={primaryDark} fontSize="48px" lineHeight="56px" fontWeight="300" sx={{ mt: '40px', mb: isLoggedIn ? '56px' : '100px' }}>
                            Nástroj pro hlášení a likvidaci injekčních stříkaček
                        </Typography>
                        {!isLoggedIn && (
                            <Typography align="left" variant="h2" color={darkGrey} fontSize="24px" lineHeight="28px" sx={{ my: '50px' }}>
                                Našli jste jehlu a nevíte co s ní?
                            </Typography>
                        )}
                        <PrimaryButton
                            text={isLoggedIn ? 'zadat nález' : 'zadat nález ANONYMNĚ'}
                            type="button"
                            onClick={() => {
                                history.push(LINKS.NEW_FIND_INIT);
                            }}
                        />
                        <Typography
                            align="left"
                            variant="body1"
                            color={darkGrey}
                            fontSize="20px"
                            lineHeight="30px"
                            sx={{ mt: isLoggedIn ? '92px' : '56px', mb: '56px', maxWidth: '420px', letterSpacing: '0.25px' }}
                        >
                            Jehlomat.cz je online nástroj, sloužící terénním pracovníkům a veřejnosti ke hlášení nálezů odhozených injekčních stříkaček a následně k jejich odborné likvidaci
                        </Typography>
                    </Grid>
                    <Grid xs={5} alignItems="center" container>
                        <img width="100%" alt="Mapa" src={map} />
                    </Grid>
                </Container>
            </>
        );
    }
};

export default LandingPage;
