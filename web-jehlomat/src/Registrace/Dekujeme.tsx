import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

import {
  primary as bgColor,
  secondary as tickColor,
  white as textColor,
} from "../Components/Utils/Colors";
import SecondaryButton from "../Components/Buttons/SecondaryButton/SecondaryButton";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${textColor};
  background-color: ${bgColor};
`;
const InfoText = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  text-align: center;
`;
const SecondaryIcon = styled(FontAwesomeIcon)`
  color: ${tickColor};
`;
const Body = styled.div`
  flex: 1;
`

export default function Dekujeme() {
  return (
    <Container>
      <h2>Teď už je to na nás</h2>
      <SecondaryIcon icon={faCheckCircle} size="3x" />
      <InfoText>
        Vaši registraci jsme přijali, po schválení vám přijde email s
        přihlašovacími údaji.
      </InfoText>
      <Link to="/">
        <SecondaryButton text="Zpět na přihlášení" />
      </Link>
    </Container>
  );
}
