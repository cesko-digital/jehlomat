import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import { primary as bgColor, white as tickColor, white as textColor } from '../../utils/colors';
import SecondaryButton from '../../components/Buttons/SecondaryButton/SecondaryButton';

const Container = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
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
    justify-content: center;
    align-items: center;
    text-align: center;
`;
const Footer = styled.div`
    margin-left: 3rem;
    margin-right: 3rem;
    margin-top: 1rem;
    border-top: 1px solid ${tickColor};
    justify-content: center;
    align-items: center;
    text-align: center;
`;

export default function OvereniEmailu() {
    return (
        <Container>
            <Body>
                <h2>Ověření emailové adresy</h2>
                <SecondaryIcon icon={faEnvelope} size="3x" />
                <InfoText>Zaslali jsme vám ověřovací email na adresu TBD. Pro dokončení registrace klikněte na link v e-mailu.</InfoText>
                <Link to="/uzivatel/novy">
                    <SecondaryButton text="Zpět na přihlášení" />
                </Link>
            </Body>
            <Footer>
                <div>Jestli jste neobdrželi e-mail</div>
                <div>Zaslat email znovu</div>
            </Footer>
        </Container>
    );
}
