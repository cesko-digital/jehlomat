import { FC, useEffect, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import { INovaJehla, STEPS } from '../NovyNalez';
import ZapnoutPolohu from './ZapnoutPolohu';
import Mapa from './Mapa';

interface IZadatNalezMapa {
    handleStepChange: (newStep: STEPS, newInfo?: Partial<INovaJehla>) => void;
    userSelectedLocation: [number | undefined, number | undefined];
}

const ZadatNalezMapa: FC<IZadatNalezMapa> = ({ handleStepChange, userSelectedLocation }) => {
    const [modalVisible, setModalVisible] = useState<boolean | null>(null);
    const [userPosition, setUserPosition] = useState<LatLngExpression | null>(null);

    // Je potřeba zjistit, jak dlouho po odkliknutí povolit polohu v prohlížeči
    // toto povolení vydrží a podle toho možná uložit cookie?
    // Podle cookie potom řešit, zda se má modal vůbec ukázat?
    useEffect(() => {
        if (userSelectedLocation[0] != undefined && userSelectedLocation[1] != undefined) {
            setUserPosition(userSelectedLocation as LatLngExpression);
        } else if ('geolocation' in navigator && userSelectedLocation[0] == undefined && userSelectedLocation[1] == undefined) {
            setModalVisible(true);
        } else {
            setModalVisible(false);
        }
    }, []);

    const handleAllowGeolocation = (lat: number, lng: number): void => {
        setModalVisible(false);
        setUserPosition([lat, lng]);
    };
    const handleDenyGeolocation = () => {
        setModalVisible(false);
    };

    return (
        <div>
            <ZapnoutPolohu visible={modalVisible!} handleAllowGeolocation={handleAllowGeolocation} handleDenyGeolocation={handleDenyGeolocation} />
            <Mapa userPosition={userPosition} handleStepChange={handleStepChange} />
        </div>
    );
};

export default ZadatNalezMapa;
