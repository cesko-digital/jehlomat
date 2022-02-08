import { FC, useContext } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import TitleBar from '../../Components/Navigation/TitleBar';
import { useHistory } from 'react-router-dom';

import { Container } from '@mui/material';
import { white } from '../../utils/colors';
import { ChevronLeft } from '@mui/icons-material';
import LoginForm from '../../Components/LoginForm/LoginForm';
import { LINKS } from 'routes';
import Link from 'Components/Link';
import { WithModal } from 'types';
import { ModalContext } from 'Components/Navigator/Navigator';

const Login: FC<WithModal> = ({ inModal }) => {
    const history = useHistory();

    const renderContent = (children: React.ReactNode) => {
        if (!inModal) {
            return (
                <Container sx={{ height: '100vh', width: '100%' }}>
                    <Grid container justifyContent="start" sx={{ height: '100%', width: '100%' }}>
                        <Box marginBottom={'85px'}>
                            <TitleBar
                                icon={<ChevronLeft sx={{ color: white, fontSize: 40 }} />}
                                onIconClick={() => {
                                    history.goBack();
                                }}
                            />
                        </Box>
                        {children}
                    </Grid>
                </Container>
            );
        } else {
            return <>{children}</>;
        }
    };

    return renderContent(
        <Grid container direction="column" sx={{ height: '100%', width: '100%', paddingX: '20px' }} justifyContent="start" alignItems="center">
            <LoginForm />

            <Box sx={{ marginTop: '60px' }}>
                <Link to={LINKS.FORGOTTEN_PASSWORD}> Zapomněli jste heslo? </Link>
            </Box>
        </Grid>,
    );
};

export default Login;
