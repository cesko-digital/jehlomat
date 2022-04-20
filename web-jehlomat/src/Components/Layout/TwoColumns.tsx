import React, { FunctionComponent } from 'react';
import { Container, Grid, styled } from '@mui/material';

export interface TwoColumnsProps {
    left?: React.ReactNode;
    right?: React.ReactNode;
}

const StretchedContainer = styled(Container)({
    display: 'flex',
    flexGrow: 1,
    background: 'greenyellow',
});

const TwoColumns: FunctionComponent<TwoColumnsProps> = ({ left, right }) => {
    return (
        <StretchedContainer>
            <Grid container columnSpacing={4} alignSelf="stretch" justifyContent="stretch" alignItems="stretch">
                {left && (
                    <Grid item xs={12} md={6} display="flex" flexDirection="column">
                        {left}
                    </Grid>
                )}
                {right && (
                    <Grid item xs={12} md={6} display="flex" flexDirection="column">
                        {right}
                    </Grid>
                )}
            </Grid>
        </StretchedContainer>
    );
};

export default TwoColumns;
