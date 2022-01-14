import { Typography, Grid, Container, useMediaQuery } from '@mui/material';
import jehlomatLogo from '../../assets/logo/logo-jehlomat-green.svg';
import map from '../../assets/images/map.png';
import { HeaderMobile } from '../../components/Header/HeaderMobile';
import { Header } from '../../components/Header/Header';
import { darkGrey, primaryDark } from '../../utils/colors';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton';
import { media } from '../../utils/media';

const LandingPage = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    if (isMobile) {
        return <HeaderMobile />;
    }

    return (
        <>
            <Header mobileTitle="" />

            <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Grid xs={6} alignItems="start" container direction="column" justifyContent="center">
                    <img height={22} alt="Jehlomat" src={jehlomatLogo} />
                    <Typography align="left" variant="h1" color={primaryDark} fontSize="48px" lineHeight="56px" sx={{ mt: '40px' }}>
                        Monitorovací ananalytický nástroj ochrany veřejného zdraví
                    </Typography>
                    <Typography align="left" variant="h2" color={darkGrey} fontSize="24px" lineHeight="28px" sx={{ my: '40px' }}>
                        Našli jste jehlu a nevíte co s ní?
                    </Typography>
                    <Grid container justifyContent="center">
                        <PrimaryButton text="zadat nález injekční stříkačky" type="button" />
                    </Grid>
                    <Typography align="left" variant="body1" color={darkGrey} fontSize="20px" lineHeight="30px" sx={{ mt: '80px' }}>
                        Aplikace jehlomat.cz slouží od roku 2014 ke sběru údajů o nálezech injekčního materiálu, které provádějí terénní pracovníci adiktologických služeb, městští strážníci či
                        pracovníci technických služeb.
                    </Typography>
                </Grid>
                <Grid xs={6} alignItems="center" container>
                    <img width="100%" alt="Mapa" src={map} />
                </Grid>
            </Container>
        </>
    );
};

export default LandingPage;
