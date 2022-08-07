import { FC, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import LocationAgreement from 'screens/Nalezy/NovyNalez/components/LocationAgreement';
import Map from 'screens/Nalezy/NovyNalez/components/Map';
import { LatLngExpression } from 'leaflet';
import { isExistingSyringe, JehlaState } from 'screens/Nalezy/NovyNalez/components/types';
import { StepsEnum } from 'screens/Nalezy/NovyNalez/components/types';
import { mapPositionState, mapUserPositionState, newSyringeInfoState, newSyringeStepState } from 'screens/Nalezy/NovyNalez/components/store';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import MapControl from 'screens/Nalezy/NovyNalez/components/MapControl';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import { FloatinButtonContainer } from 'screens/Nalezy/NovyNalez/components/styled';
import { media } from 'utils/media';

interface IZadatNalezMapa {
    userSelectedLocation: [number | undefined, number | undefined];
}

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 600px;

    @media ${media.lte('mobile')} {
        // compensate parent padding, nasty but easiest
        width: 100vw;
        transform: translateX(-16px);
        height: 80vh;
    }
`;

export enum LocationState {
    CHECKING = 'CHECKING',
    GRANTED = 'GRANTED',
}

const ZadatNalezMapa: FC<IZadatNalezMapa> = ({ userSelectedLocation }) => {
    const [modalVisible, setModalVisible] = useState<boolean | null>(null);
    const [, setUserPosition] = useRecoilState(mapUserPositionState);
    const [locationState, setLocationState] = useState<LocationState>();
    const setCurrentStep = useSetRecoilState(newSyringeStepState);
    const [syringeInfo, setNewSyringeInfo] = useRecoilState(newSyringeInfoState);
    const mapPosition = useRecoilValue(mapPositionState);

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

    const convertPositionToInfo = useCallback(() => {
        if (mapPosition != null) {
            const [lat, lng] = mapPosition.toString().split(',');
            return { lat: Number(lat), lng: Number(lng) };
        }
        return { lat: undefined, lng: undefined };
    }, [mapPosition]);

    const onAddPlaceClick = useCallback(() => {
        setNewSyringeInfo((syringeInfo: JehlaState) => ({ ...syringeInfo, ...convertPositionToInfo() }));
        setCurrentStep(StepsEnum.Info);
    }, [convertPositionToInfo, setNewSyringeInfo, setCurrentStep]);

    return (
        <StyledContainer id="map-container">
            <Map>
                <LocationAgreement visible={modalVisible!} handleAllowGeolocation={handleAllowGeolocation} handleDenyGeolocation={handleDenyGeolocation} locationState={locationState} />
                <MapControl />
                <FloatinButtonContainer>
                    <PrimaryButton text={`${isExistingSyringe(syringeInfo) && syringeInfo.edit ? 'Editovat' : 'Vložit'} místo`} onClick={onAddPlaceClick} />
                </FloatinButtonContainer>
            </Map>
        </StyledContainer>
    );
};

export default ZadatNalezMapa;
