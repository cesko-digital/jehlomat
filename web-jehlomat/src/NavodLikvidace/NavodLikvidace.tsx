import React, { FC } from 'react';
import { Formik, Form } from 'formik';
import TextInput from '../Components/Inputs/TextInput/TextInput';
import PrimaryButton from '../Components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from '../Components/Buttons/TextButton/TextButton';
import { AxiosResponse } from 'axios';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { primaryDark } from '../Components/Utils/Colors';
import TitleBar from '../Components/Navigation/TitleBar';

interface INavodLikvidace {
    onClickPrimaryButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickTextButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const NavodLikvidace: FC<INavodLikvidace> = ({ onClickPrimaryButton, onClickTextButton }) => {
    const handleOnClickPrimaryButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClickPrimaryButton(event);
    };

    const handleOnClickTextButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClickTextButton(event);
    };

    return (
        <Container maxWidth="xs" sx={{ height: '100vh' }}>
            <TitleBar>Jak bezpečně zlikvidovat nález</TitleBar>
            <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                <Typography align="center" variant="body1" color={primaryDark}>
                    Návod jak bezpečně zlikvidovat nález
                </Typography>
                <Box sx={{ mt: '1rem', width: '100%' }}></Box>
                <PrimaryButton text="Nález jsem zlikvidoval" type="button" onClick={handleOnClickPrimaryButton} />
                <Box sx={{ mt: '1rem', width: '100%' }}></Box>
                <TextButton text="Nechci nález likvidovat sám" type="button" onClick={handleOnClickTextButton} />
            </Grid>
        </Container>
    );
};

export default NavodLikvidace;
