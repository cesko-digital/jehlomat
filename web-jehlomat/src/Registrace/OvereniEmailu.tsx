import React from "react";
import {
  Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import { 
  primary as bgColor, 
  secondary as tickColor,
  white as textColor 
} from '../Components/Utils/Colors' 
import SecondaryButton from '../Components/Buttons/SecondaryButton/SecondaryButton';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${textColor};
  background-color: ${bgColor};
`
const InfoText = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  text-align: center;
`
const SecondaryIcon = styled(FontAwesomeIcon)`
  color: ${tickColor};
`

export default function OvereniEmailu() {
  return (
    <Container>
      <h2>Ověření emailové adresy</h2>
      <SecondaryIcon icon={faEnvelope} size="3x" />
      <InfoText>Zaslali jsme vám ověřovací email na adresu TBD. 
        Pro dokončení registrace klikněte na link v e-mailu.</InfoText>
      <Link to="/">
        <SecondaryButton text="Zpět na přihlášení" />
      </Link>
    </Container>
  );
}