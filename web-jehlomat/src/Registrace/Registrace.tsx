import React from "react";
import {
  Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Registrace() {
  return (
    <Container>
      <h2>Teď už je to na nás</h2>
      <FontAwesomeIcon icon={faCheckCircle} size="2x" />
      <div>Vaši registraci jsme přijali, po schválení vám přijde email
        s přihlašovacími údaji.</div>
      <Link to="/">
        <button>Zpět na přihlášení</button>
      </Link>
    </Container>
  );
}