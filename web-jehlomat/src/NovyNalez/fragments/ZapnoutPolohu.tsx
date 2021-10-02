import { LatLngExpression } from 'leaflet';
import { FC } from 'react';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from '../../Components/Buttons/TextButton/TextButton';
import { ModalBody, ModalContainer } from '../../Components/Modal/ModalStyles';

interface IZapnoutPolohu {
    visible: boolean;
    handleAllowGeolocation: (lat: number, lng: number) => void;
    handleDenyGeolocation: () => void;
}

const ZapnoutPolohu: FC<IZapnoutPolohu> = ({ visible, handleAllowGeolocation, handleDenyGeolocation }) => {
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
