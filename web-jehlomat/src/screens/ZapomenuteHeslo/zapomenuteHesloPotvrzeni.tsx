import { Box, Grid, Typography } from '@mui/material';
import { CheckIcon } from 'assets/CheckIcon';
import Modal from 'Components/Modal/Modal';
import { useHistory } from 'react-router';
import { primary, secondary } from 'utils/colors';

const ZapomenuteHesloPotvrzeni = () => {
    const history = useHistory();

    return (
        <Modal open={true} onClose={() => history.push('/')}>
            <Grid container direction="column" sx={{ height: 'auto', width: '100%', padding: '20px' }} justifyContent="start" alignItems="center">
                <Typography align="center" variant="body1" color={primary} sx={{ mb: '2rem' }}>
                    Email byl úspěšně
                </Typography>
                <Typography align="center" variant="body1" color={primary} sx={{ mb: '2rem' }} fontSize={48}>
                    ODESLÁN
                </Typography>
                <Box sx={{ width: 70, height: 70, backgroundColor: secondary, borderRadius: '100%', color: 'white' }}>
                    <CheckIcon />
                </Box>
            </Grid>
        </Modal>
    );
};

export default ZapomenuteHesloPotvrzeni;
