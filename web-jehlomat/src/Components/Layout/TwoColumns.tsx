import React, { FunctionComponent } from 'react';
import { Container, Grid, styled } from '@mui/material';

export interface TwoColumnsProps {
    left?: React.ReactNode;
    right?: React.ReactNode;
}

const StretchedContainer = styled(Container)({
    flexGrow: 1,
});

const TwoColumns: FunctionComponent<TwoColumnsProps> = ({ left, right }) => {
    return (
        <StretchedContainer>
            <Grid container spacing={4}>
                {left && (
                    <Grid item xs={12} md={6}>
                        {left}
                    </Grid>
                )}
                {right && (
                    <Grid item xs={12} md={6}>
                        {right}
                    </Grid>
                )}
            </Grid>
        </StretchedContainer>
    );
};

export default TwoColumns;
