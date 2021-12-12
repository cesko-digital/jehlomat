import PrimaryButton from '../Components/Buttons/PrimaryButton/PrimaryButton';
import { primaryDark, darkGrey } from '../Components/Utils/Colors';
import { Typography, Grid, Container } from '@mui/material';
import jehlomatLogo from '../assets/logo/logo-jehlomat.svg';
import map from '../assets/images/map.png';

const LandingPage = () => {
    return (
        <Container maxWidth="lg" sx={{ height: '100vh' }}>
            <Grid container sx={{ height: '100%' }}>
                <Grid xs={6} alignItems="start" container direction="column" justifyContent="center">
                    <img height={22} alt="Jehlomat" src={jehlomatLogo} />
                    <Typography align="left" variant="h1" color={primaryDark} fontSize="48px" lineHeight="56px">
                        Monitorovací a analytický nástroj ochrany veřejného zdraví
                    </Typography>
                    <Typography align="left" variant="h2" color={darkGrey} fontSize="24px" lineHeight="28px">
                        Našli jste jehlu a nevíte co s ní?
                    </Typography>
                    <PrimaryButton text="zadat nález injekční stříkačky" type="button" />
                    <Typography align="left" variant="body1" color={darkGrey} fontSize="20px" lineHeight="30px">
                        Aplikace jehlomat.cz slouží od roku 2014 ke sběru údajů o nálezech injekčního materiálu, které provádějí terénní pracovníci adiktologických služeb, městští strážníci či
                        pracovníci technických služeb.
                    </Typography>
                </Grid>
                <Grid xs={6} alignItems="center" container>
                    <img width="100%" alt="Mapa" src={map} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default LandingPage;
