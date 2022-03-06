import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { LatLngExpression } from 'leaflet';
import ZapnoutPolohu from './ZapnoutPolohu';
import Mapa from './Mapa';
import { INovaJehla, StepsEnum } from '../NovyNalezContainer';
import { LocationState } from './types';
import { MapContext } from './MapContext';

interface IZadatNalezMapa {
    handleStepChange: (newStep: StepsEnum, newInfo?: Partial<INovaJehla>) => void;
    userSelectedLocation: [number | undefined, number | undefined];
}

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
`;

const ZadatNalezMapa: FC<IZadatNalezMapa> = ({ handleStepChange, userSelectedLocation }) => {
    const [modalVisible, setModalVisible] = useState<boolean | null>(null);
    const [userPosition, setUserPosition] = useState<LatLngExpression | null>(null);
    const [mapSize, setMapSize] = useState<Record<'height' | 'width', number> | null>(null);

    const [locationState, setLocationState] = useState<LocationState>();

    // Je potřeba zjistit, jak dlouho po odkliknutí povolit polohu v prohlížeči
    // toto povolení vydrží a podle toho možná uložit cookie?
    // Podle cookie potom řešit, zda se má modal vůbec ukázat?
    useEffect(() => {
        if (userSelectedLocation[0] != undefined && userSelectedLocation[1] != undefined) {
            setUserPosition(userSelectedLocation as LatLngExpression);
        } else {
            setLocationState(LocationState.CHECKING);
            navigator.geolocation.getCurrentPosition(
                position => {
                    console.log('getting location', position);
                    if (position.coords.latitude) {
                        handleAllowGeolocation(position.coords.latitude, position.coords.longitude);
                        setLocationState(LocationState.GRANTED);
                    }
                },
                () => {},
            );
        }

        if ('geolocation' in navigator && userSelectedLocation[0] == undefined && userSelectedLocation[1] == undefined) {
            setModalVisible(true);
        } else {
            setModalVisible(false);
        }
    }, []);

    useEffect(() => {
        if (locationState === LocationState.GRANTED && modalVisible) {
            setModalVisible(false);
        }
    }, [modalVisible, locationState]);

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
        <StyledContainer id="map-container">
            <MapContext.Provider value={{position: userPosition, setPosition: setUserPosition}}>
                <ZapnoutPolohu visible={modalVisible!} handleAllowGeolocation={handleAllowGeolocation} handleDenyGeolocation={handleDenyGeolocation} locationState={locationState} />
                {mapSize && mapSize.width != 0 && mapSize.height != 0 && (
                    <Mapa handleStepChange={handleStepChange} width={mapSize.width} height={mapSize.height}  />
                )}
            </MapContext.Provider>
        </StyledContainer>
    );
};

export default ZadatNalezMapa;
