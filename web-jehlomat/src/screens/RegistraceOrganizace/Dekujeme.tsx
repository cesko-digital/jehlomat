import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import SecondaryButton from '../../components/Buttons/SecondaryButton/SecondaryButton';
import { primary, secondary, white } from '../../utils/colors';

const Container = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: ${white};
    background-color: ${primary};
`;

const InfoText = styled.div`
    margin-top: 2rem;
    margin-bottom: 2rem;
    display: flex;
    text-align: center;
`;

const SecondaryIcon = styled(FontAwesomeIcon)`
    color: ${secondary};
`;

export default function Dekujeme() {
    return (
        <Container>
            <h2>Teď už je to na nás</h2>
            <SecondaryIcon icon={faCheckCircle} size="3x" />
            <InfoText>Vaši registraci jsme přijali, po schválení vám přijde email s přihlašovacími údaji.</InfoText>
            <Link to="/">
                <SecondaryButton text="Zpět na přihlášení" />
            </Link>
        </Container>
    );
}
