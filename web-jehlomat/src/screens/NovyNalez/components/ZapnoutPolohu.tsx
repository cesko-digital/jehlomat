import {FC} from 'react';
import PrimaryButton from '../../../Components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from '../../../Components/Buttons/TextButton/TextButton';
import {ModalBody, ModalContainer} from './../../../Components/Modal/ModalStyles';
import {LocationState} from "./types";

interface Props {
    visible: boolean;
    handleAllowGeolocation: (lat: number, lng: number) => void;
    handleDenyGeolocation: () => void;
    locationState?: LocationState;
}

const ZapnoutPolohu: FC<Props> = ({ visible, handleAllowGeolocation, handleDenyGeolocation , locationState}) => {
    const getUserGeolocation = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                handleAllowGeolocation(position.coords.latitude, position.coords.longitude);
            },
            positionError => console.log(positionError),
        );
    };

    if (visible) {
        return (
            <ModalContainer>
                <ModalBody>
                    {locationState && locationState === LocationState.CHECKING ? <>Zjišťování stavu vaší polohy...</> : <PrimaryButton text="Povolit použítí mojí lokality" onClick={getUserGeolocation} />}

                    <TextButton text="Zadat místo do mapy bez mojí lokalizace" onClick={handleDenyGeolocation} />
                </ModalBody>
            </ModalContainer>
        );
    }

    return null;
};

export default ZapnoutPolohu;
