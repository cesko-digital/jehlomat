import { FC, Fragment, useEffect, useState } from 'react';
import ZapnoutPolohu from '../fragments/ZapnoutPolohu';
import Mapa from '../fragments/Mapa';
import { LatLngExpression } from 'leaflet';

interface IZadatNalezMapa {}

const ZadatNalezMapa: FC<IZadatNalezMapa> = () => {
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
        // setUserPosition([lat, lng]);
    };
    const handleDenyGeolocation = () => {
        setModalVisible(false);
    };

    return (
        <Fragment>
            <div>
                <ZapnoutPolohu visible={modalVisible!} handleAllowGeolocation={handleAllowGeolocation} handleDenyGeolocation={handleDenyGeolocation} />
                <Mapa userPosition={userPosition} />
            </div>
        </Fragment>
    );
};

export default ZadatNalezMapa;
