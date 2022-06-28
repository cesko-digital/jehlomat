import React, {  useState } from 'react';

import { useSetRecoilState } from 'recoil';
import styled from '@emotion/styled';
import { primary } from 'utils/colors';
import questionMark from 'assets/icons/question_mark.svg';
import location from 'assets/icons/location.svg';
import spinner from 'assets/icons/tail-spin.svg';
import { mapUserPositionState } from 'screens/Nalezy/NovyNalez/components/store';

interface MapControlProps {
    // onSearchSubmit: (search: string) => void;
    // onLocationClick: () => void;
}

const StyledWrapper = styled.div`
    position: absolute;
    left: 1rem;
    top: 2rem;
    z-index: 100;
`;

const StyledItem = styled.div<{ expanded?: boolean }>`
    border-radius: 100%;
    width: 56px;
    height: 56px;
    background-color: ${primary};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 19px;
    transition: 0.2s all;

    ${({ expanded }: any) =>
        expanded &&
        `
    width: 80vw;
    max-width: 600px;
    border-radius: 56px;
    justify-content: center;
  `}
`;

export const MapControl: React.FC<MapControlProps> = ({}) => {
    const [checkingPosition, setCheckingPosition] = useState(false);
    const setPosition = useSetRecoilState(mapUserPositionState);

    const getUserGeolocation = () => {
        setCheckingPosition(true);

        navigator.geolocation.getCurrentPosition(
            position => {
                setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
                setCheckingPosition(false);
            },
            positionError => {
                setCheckingPosition(false);
            },
        );
    };

    return (
        <StyledWrapper>
            {/* Adress search
             <StyledItem onClick={() => !searchShown && setSearchShown(true)} expanded={searchShown}>
                <img src={searchIcon} alt="hledat" onClick={() => searchShown && setSearchShown(false)} />
                {searchShown && <AddressSearch />}
            </StyledItem>*/}
            <StyledItem>
                <img src={questionMark} alt="help" />
            </StyledItem>
            <StyledItem onClick={getUserGeolocation}>
                <img src={checkingPosition ? spinner : location} alt="current location" />
            </StyledItem>
        </StyledWrapper>
    );
};

export default MapControl;
