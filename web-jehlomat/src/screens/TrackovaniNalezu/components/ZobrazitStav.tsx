import React, { FC } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { primary, secondary, white } from 'utils/colors';
import { CheckIcon } from 'assets/CheckIcon';
import Box from '@mui/material/Box';
import { ISyringeState } from 'screens/TrackovaniNalezu/TrackovaniNalezu.config';
import { Container, useMediaQuery } from '@mui/material';
import { media } from 'utils/media';

interface IZobrazitStav {
    syringeState: ISyringeState;
    height: string;
}

const ZobrazitStav: FC<IZobrazitStav> = ({ syringeState, height }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    return (
        <Container maxWidth="xs" sx={{ height, display: 'flex', flexGrow: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: isMobile ? primary : white }}>
            <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    {isMobile && (
                        <>
                            <Typography align="center" variant="body1" color={'white'} sx={{ mb: '2rem' }}>
                                Stav nálezu v aplikaci
                            </Typography>
                            <Typography align="center" variant="h2" color={'white'} sx={{ mb: '2rem' }}>
                                jehlomat
                            </Typography>
                        </>
                    )}
                    <Typography align="center" variant="body1" color={isMobile ? 'white' : primary} sx={{ mb: '2rem' }}>
                        {syringeState.firstLine}
                    </Typography>
                    <Typography align="center" variant="body1" color={isMobile ? 'white' : primary} sx={{ mb: '2rem' }} fontSize={isMobile ? 24 : 48}>
                        {syringeState.secondLine}
                    </Typography>
                    {syringeState.hasCheckMark && (
                        <Box sx={{ width: 70, height: 70, backgroundColor: secondary, borderRadius: '100%', color: 'white' }}>
                            <CheckIcon />
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default ZobrazitStav;
