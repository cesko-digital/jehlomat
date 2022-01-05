import { FC, useEffect, useState } from 'react';
import ZapnoutPolohu from './ZapnoutPolohu';
import Mapa from './Mapa';
import { LatLngExpression } from 'leaflet';
import { INovaJehla, StepsEnum } from '../NovyNalezContainer';

interface IZadatNalezMapa {
    handleStepChange: (newStep: StepsEnum, newInfo?: Partial<INovaJehla>) => void;
    userSelectedLocation: [number | undefined, number | undefined];
}

const ZadatNalezMapa: FC<IZadatNalezMapa> = ({ handleStepChange, userSelectedLocation }) => {
    const [modalVisible, setModalVisible] = useState<boolean | null>(null);
    const [userPosition, setUserPosition] = useState<LatLngExpression | null>(null);
    const [mapSize, setMapSize] = useState<Record<'height' | 'width', number> | null>(null);

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

    /**
     * Získá aktuální velikost containeru.
     */
    const resizeMap = () => {
        const contentContainer = document.getElementById('content-container');
        if (contentContainer) {
            setMapSize({ width: contentContainer.clientWidth, height: contentContainer.clientHeight * 0.95 });
        }
    };

    /**
     * Tohle nefunguje úplně jak by mělo, protože Leaflet componenta má immutable props, takže se při změně props nepřerendruje mapa, ale komponenta jako taková ano.
     *
     * Nechám to tady, když se nám podaří najít nějaký hack, tak abychom na to nezapomněli.
     */
    useEffect(() => {
        resizeMap();
        // window.addEventListener('resize', resizeMap);

        // return () => {
        //     window.removeEventListener('resize', resizeMap);
        // };
    }, []);

    const handleAllowGeolocation = (lat: number, lng: number): void => {
        setModalVisible(false);
        setUserPosition([lat, lng]);
    };
    const handleDenyGeolocation = () => {
        setModalVisible(false);
    };

    return (
        <div id="map-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <ZapnoutPolohu visible={modalVisible!} handleAllowGeolocation={handleAllowGeolocation} handleDenyGeolocation={handleDenyGeolocation} />
            {mapSize && mapSize.width != 0 && mapSize.height != 0 && <Mapa userPosition={userPosition} handleStepChange={handleStepChange} width={mapSize.width} height={mapSize.height} />}
        </div>
    );
};

export default ZadatNalezMapa;
