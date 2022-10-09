import React from 'react';
import { Link, useParams } from 'react-router-dom';
import envelopeIcon from 'assets/icons/envelope.svg';
import overeniEmailu from 'assets/images/overeniEmailu.svg';
import styled from '@emotion/styled';

import { primary, white, grey } from '../../utils/colors';
import SecondaryButton from '../../Components/Buttons/SecondaryButton/SecondaryButton';
import { Container, Grid, useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
import { Header } from 'Components/Header/Header';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';

const MobileWrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: ${white};
    background-color: ${primary};
    min-height: 100vh;
    padding: 72px 38px 0 38px;
`;

const Icon = styled.img`
    margin-top: 55px;
    margin-bottom: 42px;
`;

const InfoText = styled.p`
    line-height: 19px;
`;

const ButtonLink = styled(Link)`
    button {
        margin-top: 55px;
    }
`;

const DesktopContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 210px;
    color: ${grey};

    h2 {
        color: ${primary};
        font-size: 48px;
        font-weight: 300;
    }

    p {
        max-width: 510px;
        line-height: 21px;
        text-align: center;
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 60px;
`;
interface IParams {
    email: string;
}

const TEXTS = {
    header: 'Ověření emailové adresy',
    line1: 'Zaslali jsme zadanému uživateli ověřovací e-mail na adresu',
    line2: 'Pro dokončení registrace klikněte na link v e-mailu.',
    button: 'Zpět na přihlášení',
};

export default function OvereniEmailu() {
    const { email } = useParams<IParams>();
    const isMobile = useMediaQuery(media.lte('mobile'));

    if (isMobile) {
        return (
            <MobileWrapper>
                <h2>{TEXTS.header}</h2>
                <Icon src={envelopeIcon} alt="obalka" />
                <InfoText>
                    {TEXTS.line1} {email}.
                </InfoText>
                <InfoText>{TEXTS.line2}</InfoText>
                <ButtonLink to="/prihlaseni">
                    <SecondaryButton text={TEXTS.button} />
                </ButtonLink>
            </MobileWrapper>
        );
    }

    return (
        <>
            <Header mobileTitle="Ověření e-mailové adresy" />
            <Container
                maxWidth="lg"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
            >
                <Grid xs={7}>
                    <DesktopContent>
                        <h2>{TEXTS.header}</h2>
                        <p>
                            {TEXTS.line1} {email}
                        </p>
                        <p>{TEXTS.line2}</p>
                        <ButtonWrapper>
                            <Link to="/prihlaseni">
                                <PrimaryButton text={TEXTS.button} />
                            </Link>
                        </ButtonWrapper>
                    </DesktopContent>
                </Grid>
                <Grid xs={5} item alignItems="center" container>
                    <img src={overeniEmailu} width="100%" alt="obalka" />
                </Grid>
            </Container>
        </>
    );
}
