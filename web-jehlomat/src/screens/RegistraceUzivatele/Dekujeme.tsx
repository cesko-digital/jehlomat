import { useHistory } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CheckCircle from '@mui/icons-material/CheckCircle';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { primary, white, secondary } from '../../utils/colors';
import TitleBar from '../../Components/Navigation/TitleBar';
import { useEffect } from 'react';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';

const Dekujeme = () => {
    let history = useHistory();

    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up('sm'));

    useEffect(() => {
        setTimeout(() => {
            history.push('/prihlaseni');
        }, 5000);
    }, []);

    return (
        <Container sx={{ height: '100vh', width: '100%', backgroundColor: desktop ? white : primary, color: desktop ? primary : white }}>
            <Grid container justifyContent="start" sx={{ height: '100%', width: '100%' }}>
                <TitleBar
                    icon={<ChevronLeft sx={{ color: white, fontSize: 40 }} />}
                    onIconClick={() => {
                        history.goBack();
                    }}
                ></TitleBar>
                <Grid container direction="column" rowSpacing={4} justifyContent="center" alignItems="center">
                    <Grid item direction="column" justifyContent="center" alignItems="center">
                        <Typography align="center" variant="body1" fontWeight="bold">
                            Vaše registrace v aplikaci
                        </Typography>
                        <Typography align="center" variant="h3" fontWeight="bold">
                            jehlomat.cz
                        </Typography>
                        <Typography align="center" variant="body1" fontWeight="bold">
                            byla úspěšná
                        </Typography>
                    </Grid>
                    <Grid item direction="column" justifyContent="center" alignItems="center">
                        <CheckCircle sx={{ color: secondary, fontSize: 80 }} />
                    </Grid>
                </Grid>
                <Grid container direction="column" rowSpacing={2} justifyContent="center" alignItems="center">
                    <PrimaryButton
                        text={'Přejít na přihlášení'}
                        onClick={() => {
                            history.push('/prihlaseni');
                        }}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dekujeme;
