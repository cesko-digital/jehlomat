import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import styled from 'styled-components';
import {LatLngExpression} from "leaflet";
import { useMap } from 'react-leaflet';
import { primary } from '../../Components/Utils/Colors';
import  searchIcon  from '../../assets/images/search.svg';
import  questionMark  from '../../assets/images/question_mark.svg';
import  location  from '../../assets/images/location.svg';
import AddressSearch from "../../NovyNalez/Components/AddressSearch";
import {ChangeView} from "../../NovyNalez/Components/ChangeView";

interface MapControlProps {
   // onSearchSubmit: (search: string) => void;
   // onLocationClick: () => void;
    setUserPosition: Dispatch<SetStateAction<LatLngExpression | null>>;
}

const StyledWrapper = styled.div`
    position: absolute;
    left: 1rem;
    top: 2rem;
    z-index: 10003;
`;

const StyledItem = styled.div<{expanded?: boolean}>`
  border-radius: 100%;
  width: 56px;
  height: 56px;
  background-color: ${primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 19px;
  transition: .2s all;
  
  ${({expanded}) => expanded && `
    width: 80vw;
    max-width: 600px;
    border-radius: 56px;
    justify-content: center;
  `}
`;


export const MapControl: React.FC<MapControlProps> = ({setUserPosition}) => {
    const [searchShown, setSearchShown ] = useState(false);
    const [changedPosition, setChangedPosition] = useState<[number, number]>();

    const getUserGeolocation = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log('got location', position)
                setUserPosition({lat: position.coords.latitude, lng: position.coords.longitude});
                setChangedPosition([ position.coords.latitude, position.coords.longitude])
            },
            positionError => console.log(positionError),
        );
    };

    return (
        <StyledWrapper>
            <StyledItem onClick={() => !searchShown && setSearchShown(true)}
            expanded={searchShown}
            >
                <img src={searchIcon} alt="hledat"
                     onClick={() => searchShown && setSearchShown(false)}
                />
                {searchShown && <AddressSearch />}
            </StyledItem>
            <StyledItem>
                <img src={questionMark} alt="help" />
            </StyledItem>
            <StyledItem onClick={getUserGeolocation} >
                <img src={location} alt="current location" />
            </StyledItem>
            {changedPosition && <ChangeView center={changedPosition} callback={() => setChangedPosition(undefined)} />}
        </StyledWrapper>
    );
};

export default MapControl;
