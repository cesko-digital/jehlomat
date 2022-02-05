import { FC } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import TitleBar from '../../Components/Navigation/TitleBar';
import { useHistory } from 'react-router-dom';

import { Container } from '@mui/material';
import { white } from '../../utils/colors';
import { ChevronLeft } from '@mui/icons-material';
import LoginForm from '../../Components/LoginForm/LoginForm';
import { LINKS } from 'utils/links';
import Link from 'Components/Link';

const Login: FC<any> = () => {
    let history = useHistory();

    return (
        <Container sx={{ height: '100vh', width: '100%' }}>
            <Grid container justifyContent="start" sx={{ height: '100%', width: '100%' }}>
                <TitleBar
                    icon={<ChevronLeft sx={{ color: white, fontSize: 40 }} />}
                    onIconClick={() => {
                        history.goBack();
                    }}
                />
                <Grid container direction="column" sx={{ height: '100%', width: '100%', paddingTop: '85px' }} justifyContent="start" alignItems="center">
                    <LoginForm />

                    <Box sx={{ marginTop: '60px' }}>
                        <Link to={LINKS.forgottenPassword}> Zapomněli jste heslo? </Link>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Login;
