import { FC } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import TitleBar from '../../Components/Navigation/TitleBar';
import { useHistory } from 'react-router-dom';

import { Container } from '@mui/material';
import { white } from '../../utils/colors';
import { ChevronLeft } from '@mui/icons-material';
import { WithModal } from 'types';
import AddUserForm from 'Components/UserForm/AddUserForm';

const AddUser: FC<WithModal> = ({ inModal }) => {
    let history = useHistory();

    const renderContent = (children: React.ReactNode) => {
        if (!inModal) {
            return (
                <Container sx={{ height: '100vh', width: '100%' }}>
                    <Grid container justifyContent="start" sx={{ height: '100%', width: '100%' }}>
                        <Box>
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
        <Grid container direction="column" sx={{ height: 'auto', width: '100%', paddingX: '20px' }} justifyContent="start" alignItems="center">
            <AddUserForm />
        </Grid>
    );
};

export default AddUser;
