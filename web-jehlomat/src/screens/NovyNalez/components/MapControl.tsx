import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { LatLngExpression } from 'leaflet';
import { useMap } from 'react-leaflet';
import { primary } from '../../Components/Utils/Colors';
import searchIcon from '../../assets/images/search.svg';
import questionMark from '../../assets/images/question_mark.svg';
import location from '../../assets/images/location.svg';
import spinner from '../../assets/images/tail-spin.svg';
import AddressSearch from '../../NovyNalez/Components/AddressSearch';
import { ChangeView } from '../../NovyNalez/Components/ChangeView';
import { MapContext } from './MapContext';

interface MapControlProps {
    // onSearchSubmit: (search: string) => void;
    // onLocationClick: () => void;
}

const StyledWrapper = styled.div`
    position: absolute;
    left: 1rem;
    top: 2rem;
    z-index: 10003;
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

    ${({ expanded }) =>
        expanded &&
        `
    width: 80vw;
    max-width: 600px;
    border-radius: 56px;
    justify-content: center;
  `}
`;

export const MapControl: React.FC<MapControlProps> = ({  }) => {
    const [searchShown, setSearchShown] = useState(false);
    const [checkingPosition, setCheckingPosition] = useState(false);
    const { setPosition } = useContext(MapContext);

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
            <StyledItem onClick={() => !searchShown && setSearchShown(true)} expanded={searchShown}>
                <img src={searchIcon} alt="hledat" onClick={() => searchShown && setSearchShown(false)} />
                {searchShown && <AddressSearch />}
            </StyledItem>
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
