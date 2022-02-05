import { Typography, Grid, Container, useMediaQuery } from '@mui/material';
import jehlomatLogo from '../../assets/logo/logo-jehlomat-green.svg';
import map from '../../assets/images/map.png';
import { HeaderMobile } from '../../Components/Header/HeaderMobile';
import { Header } from '../../Components/Header/Header';
import { darkGrey, primaryDark } from '../../utils/colors';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import { media } from '../../utils/media';

const LandingPage = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));

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
                    <Typography align="left" variant="h1" color={primaryDark} fontSize="48px" lineHeight="56px" fontWeight="300" sx={{ mt: '40px', mb: '100px' }}>
                        Nástroj pro hlášení a likvidaci injekčních stříkaček
                    </Typography>
                    <Typography align="left" variant="h2" color={darkGrey} fontSize="24px" lineHeight="28px" sx={{ my: '50px' }}>
                        Našli jste jehlu a nevíte co s ní?
                    </Typography>
                    {/*<Grid container justifyContent="left">*/}
                    <PrimaryButton text="zadat nález ANONYMNĚ" type="button" />
                    {/*</Grid>*/}
                    <Typography align="left" variant="body1" color={darkGrey} fontSize="20px" lineHeight="30px" sx={{ mt: '56px', maxWidth: '420px', letterSpacing: '0.25px' }}>
                        Jehlomat.cz je online nástroj, sloužící terénním pracovníkům a veřejnosti ke hlášení nálezů odhozených injekčních stříkaček a následně k jejich odborné likvidaci
                    </Typography>
                </Grid>
                <Grid xs={5} alignItems="center" container>
                    <img width="120%" alt="Mapa" src={map} />
                </Grid>
            </Container>
        </>
    );
};

export default LandingPage;
