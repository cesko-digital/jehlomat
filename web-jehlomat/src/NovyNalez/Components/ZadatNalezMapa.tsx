import { FC, Fragment, useEffect, useState } from 'react';
import ZapnoutPolohu from './ZapnoutPolohu';
import Mapa from './Mapa';
import { LatLngExpression } from 'leaflet';
import { INovaJehla, STEPS } from '../NovyNalez';

interface IZadatNalezMapa {
    handleStepChange: (newStep: STEPS, newInfo?: Partial<INovaJehla>) => void;
}

const ZadatNalezMapa: FC<IZadatNalezMapa> = ({ handleStepChange }) => {
    const [modalVisible, setModalVisible] = useState<boolean | null>(null);
    const [userPosition, setUserPosition] = useState<LatLngExpression | null>(null);

    // Je potřeba zjistit, jak dlouho po odkliknutí povolit polohu v prohlížeči
    // toto povolení vydrží a podle toho možná uložit cookie?
    // Podle cookie potom řešit, zda se má modal vůbec ukázat?
    useEffect(() => {
        if ('geolocation' in navigator) {
            setModalVisible(true);
        } else {
            setModalVisible(false);
        }
    }, []);

    const handleAllowGeolocation = (lat: number, lng: number): void => {
        setModalVisible(false);

        // TO-DO: Nefunguje to správně, mapa se nerefreshne
        //
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
