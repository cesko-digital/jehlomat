import { FC } from 'react';
import Box from '@mui/material/Box';

import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from 'Components/Buttons/TextButton/TextButton';
import { ModalBody, ModalContainer } from 'Components/Modal/ModalStyles';
import { LocationState } from 'screens/Nalezy/NovyNalez/components/types';
import { primary } from 'utils/colors';

interface Props {
    visible: boolean;
    handleAllowGeolocation: (lat: number, lng: number) => void;
    handleDenyGeolocation: () => void;
    locationState?: LocationState;
}

const LocationAgreement: FC<Props> = ({ visible, handleAllowGeolocation, handleDenyGeolocation, locationState }) => {
    const getUserGeolocation = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                handleAllowGeolocation(position.coords.latitude, position.coords.longitude);
            },
            () => handleDenyGeolocation(),
        );
    };

    if (visible) {
        return (
            <ModalContainer>
                <ModalBody>
                    {locationState && locationState === LocationState.CHECKING ? (
                        <Box sx={{ fontSize: 'h5.fontSize' }}>Zjišťování stavu vaší polohy...</Box>
                    ) : (
                        <PrimaryButton text="Povolit použítí mojí lokality" onClick={getUserGeolocation} />
                    )}
                    <Box mt={1}>
                        <TextButton color={primary} text="Zadat místo do mapy bez mojí lokalizace" onClick={handleDenyGeolocation} />
                    </Box>
                </ModalBody>
            </ModalContainer>
        );
    }

    return null;
};

export default LocationAgreement;
