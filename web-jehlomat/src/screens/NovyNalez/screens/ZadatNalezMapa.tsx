import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import LocationAgreement from 'screens/NovyNalez/components/LocationAgreement';
import Map from 'screens/NovyNalez/components/Map';
import { LatLngExpression } from 'leaflet';
import { INovaJehla, StepsEnum } from 'screens/NovyNalez/NovyNalezContainer';
import { MapContext } from 'screens/NovyNalez/components/MapContext';

interface IZadatNalezMapa {
    handleStepChange: (newStep: StepsEnum, newInfo?: Partial<INovaJehla>) => void;
    userSelectedLocation: [number | undefined, number | undefined];
}

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80vh;
    width: 100%;

    @media (max-width: 768px) {
        // compensate parent padding, nasty but easiest
        width: 100vw;
        transform: translateX(-16px);
    }
`;

export enum LocationState {
    CHECKING = 'CHECKING',
    GRANTED = 'GRANTED',
}

const ZadatNalezMapa: FC<IZadatNalezMapa> = ({ handleStepChange, userSelectedLocation }) => {
    const [modalVisible, setModalVisible] = useState<boolean | null>(null);
    const [userPosition, setUserPosition] = useState<LatLngExpression | null>(null);
    const [locationState, setLocationState] = useState<LocationState>();


    useEffect(() => {
        if (!!userSelectedLocation[0] && !!userSelectedLocation[1]) {
            setUserPosition(userSelectedLocation as LatLngExpression);
        } else {
            setLocationState(LocationState.CHECKING);
            navigator.geolocation.getCurrentPosition(
                position => {
                    if (position.coords.latitude) {
                        handleAllowGeolocation(position.coords.latitude, position.coords.longitude);
                        setLocationState(LocationState.GRANTED);
                    }
                },
                () => setModalVisible(false),
            );
        }

        if ('geolocation' in navigator && userSelectedLocation[0] === undefined && userSelectedLocation[1] === undefined) {
            setModalVisible(true);
        } else {
            setModalVisible(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (locationState === LocationState.GRANTED && modalVisible) {
            setModalVisible(false);
        }
    }, [modalVisible, locationState]);


    const handleAllowGeolocation = useCallback(
        (lat: number, lng: number): void => {
            setModalVisible(false);
            setUserPosition([lat, lng]);
        },
        [setModalVisible, setUserPosition],
    );

    const handleDenyGeolocation = useCallback(() => {
        setModalVisible(false);
    }, [setModalVisible]);

    return (
        <StyledContainer id="map-container">
            <MapContext.Provider value={{ position: userPosition, setPosition: setUserPosition }}>
                <LocationAgreement visible={modalVisible!} handleAllowGeolocation={handleAllowGeolocation} handleDenyGeolocation={handleDenyGeolocation} locationState={locationState} />
                <Map handleStepChange={handleStepChange} />
            </MapContext.Provider>
        </StyledContainer>
    );
};

export default ZadatNalezMapa;
