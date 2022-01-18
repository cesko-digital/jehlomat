import { FC } from 'react';
import PrimaryButton from '../../../components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from '../../../components/Buttons/TextButton/TextButton';
import { ModalBody, ModalContainer } from '../../../components/Modal/ModalStyles';

interface Props {
    visible: boolean;
    handleAllowGeolocation: (lat: number, lng: number) => void;
    handleDenyGeolocation: () => void;
}

const ZapnoutPolohu: FC<Props> = ({ visible, handleAllowGeolocation, handleDenyGeolocation }) => {
    const getUserGeolocation = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log(position);
                handleAllowGeolocation(position.coords.latitude, position.coords.longitude);
            },
            positionError => console.log(positionError),
        );
    };

    if (visible) {
        return (
            <ModalContainer>
                <ModalBody>
                    <PrimaryButton text="Povolit použítí mojí lokality" onClick={getUserGeolocation} />
                    <TextButton text="Zadat místo do mapy bez mojí lokalizace" onClick={handleDenyGeolocation} />
                </ModalBody>
            </ModalContainer>
        );
    }

    return null;
};

export default ZapnoutPolohu;
