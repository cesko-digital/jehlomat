import React, { FC } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TitleBar from '../Components/Navigation/TitleBar';
import TextInput from '../Components/Inputs/TextInput/TextInput';
import PrimaryButton from '../Components/Buttons/PrimaryButton/PrimaryButton';
import IconButton from '../Components/Buttons/IconButton/index';
import TextButton from '../Components/Buttons/TextButton/TextButton';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { secondary } from '../Components/Utils/Colors';

interface IDetailNalezu {}

const DetailNalezu: FC<IDetailNalezu> = () => {
    const history = useHistory();

    const handleOnClickBackButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        history.goBack();
    };
    const handleOnClickPrimaryButton = () => {};
    const handleOnClickTextButton = () => {};

    return (
        <Container maxWidth="xs" sx={{ height: '100vh' }}>
            <Grid container direction="column" justifyContent="center" alignItems="center">
                <TitleBar icon={faChevronLeft} onIconClick={handleOnClickBackButton}>
                    Zpět na list nálezů
                </TitleBar>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <Box sx={{ mt: '20px', width: '100%' }}>
                        <TextInput label="Stav nálezu" type="text" />
                    </Box>
                    <Box sx={{ mt: '8px', width: '100%' }}>
                        <TextInput label="Místo nálezu" type="text" />
                    </Box>
                    <Box sx={{ my: '20px' }}>
                        <IconButton leftElement={<FontAwesomeIcon icon={faMapMarkerAlt} color={secondary} />} text="Zobrazit na mapě" />
                    </Box>
                    <TextInput label="Datum a čas nálezu" type="date" />
                    <Box sx={{ mt: '8px', width: '100%' }}>
                        <TextInput label="Poznámka k nálezu" type="text" />
                    </Box>
                    <Box sx={{ mt: '20px' }}>
                        <PrimaryButton text="Zlikviduji nález hned" type="button" onClick={handleOnClickPrimaryButton} />
                    </Box>
                    <Box sx={{ mt: '10px' }}>
                        <TextButton text="Rezervace nálezu" type="button" onClick={handleOnClickTextButton} />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DetailNalezu;
