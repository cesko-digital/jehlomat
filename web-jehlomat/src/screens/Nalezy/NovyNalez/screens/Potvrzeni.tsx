import { FC } from 'react';
import styled from '@emotion/styled';
import { useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { useRecoilValue } from 'recoil';
import Link from 'Components/Link';

import { primary, white } from 'utils/colors';
import { fontFamilyRoboto } from 'utils/typography';
import { media } from 'utils/media';
import { LINKS } from 'routes';
import { isLoginValidState } from 'store/login';
import imageSrc from 'assets/images/finish-line.svg';

interface Props {
    trackingCode: string | null;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    background-color: ${primary};
    padding: 1rem;
    height: 75vh;

    @media (min-width: 700px) {
        background-color: ${white};
        padding: 0 1rem 3rem;
        height: auto;
    }
`;

const TextContainer = styled.div`
    margin-bottom: 2rem;
`;

const TopText = styled.h1`
    ${fontFamilyRoboto}
    text-align: center;
    color: ${white};
    margin: 0;
    font-weight: 700;
    font-size: 32px;
    line-height: 1.25;

    @media (min-width: 700px) {
        color: ${primary};
        font-size: 48px;
        font-weight: 300;
    }
`;

const TrackingText = styled.p`
    ${fontFamilyRoboto}
    text-align: center;
    color: ${white};
    margin: 0;
    font-weight: 700;
    font-size: 24px;
    line-height: 2;

    @media (min-width: 700px) {
        color: ${primary};
        font-weight: 300;
        line-height: 1.4;
    }
`;

const TrackingCode = styled(TrackingText)`
    letter-spacing: 0.3em;
`;

const LinksContainer = styled.div`
    width: 100%;
    display: flex;
    margin-top: 2rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (min-width: 700px) {
        margin-top: 2rem;
    }
`;

const StyledLink = styled(Link)`
    width: 40%;
    margin: 0 5% 1rem;
    color: ${white};

    @media (min-width: 700px) {
        color: ${primary};
    }
`;

const Potvrzeni: FC<Props> = ({ trackingCode }) => {
    const isLoggedIn = useRecoilValue(isLoginValidState);
    const isDesktop = useMediaQuery(media.gt('mobile'));

    return (
        <Container>
            {isDesktop && (
                <Box alignItems="center" pb={4}>
                    <img src={imageSrc} height="285" alt="finish-line" />
                </Box>
            )}
            <TextContainer>
                <TopText>Vložení nálezu bylo úspěšné</TopText>
            </TextContainer>
            {!isLoggedIn && trackingCode && (
                <>
                    <Box>
                        <TrackingText>Trasovací kód pro jeho sledování:</TrackingText>
                        <TrackingCode>{trackingCode}</TrackingCode>
                    </Box>
                    <LinksContainer>
                        <StyledLink to={LINKS.FINDINGS_NOTIFY_POLICE}>Chci nález zlikvidovat sám</StyledLink>
                    </LinksContainer>
                </>
            )}
        </Container>
    );
};

export default Potvrzeni;
