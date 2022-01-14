import React, { FC } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { primary, secondary } from '../../../utils/colors';
import TitleBar from '../../../components/Navigation/TitleBar';
import { CheckIcon } from '../../../assets/CheckIcon';
import Box from '@mui/material/Box';
import { ISyringeState } from '../TrackovaniNalezu';

interface IZobrazitStav {
    syringeState: ISyringeState;
}

const ZobrazitStav: FC<IZobrazitStav> = ({ syringeState }) => {
    return (
        <Box sx={{ height: '100vh', backgroundColor: primary }}>
            <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <Typography align="center" variant="body1" color={'white'} sx={{ mb: '2rem' }}>
                        Stav nálezu v aplikaci
                    </Typography>
                    <Typography align="center" variant="h2" color={'white'} sx={{ mb: '2rem' }}>
                        jehlomat
                    </Typography>
                    <Typography align="center" variant="body1" color={'white'} sx={{ mb: '2rem' }}>
                        {syringeState.firstLine}
                    </Typography>
                    <Typography align="center" variant="body1" color={'white'} sx={{ mb: '2rem' }}>
                        {syringeState.secondLine}
                    </Typography>
                    {syringeState.hasCheckMark && (
                        <Box sx={{ width: 70, height: 70, backgroundColor: secondary, borderRadius: '100%', color: 'white' }}>
                            <CheckIcon />
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default ZobrazitStav;
