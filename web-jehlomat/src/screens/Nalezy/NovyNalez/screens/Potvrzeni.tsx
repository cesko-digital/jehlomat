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
import CheckIcon from 'assets/icons/check.svg';
import { SCheckIcon } from 'screens/RegistraceOrganizace/Dekujeme.styled';

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

    @media ${media.gt('mobile')} {
        background-color: ${white};
        padding: 0 1rem 3rem;
        height: auto;
    }
`;

const TopText = styled.h1`
    ${fontFamilyRoboto}
    text-align: center;
    color: ${white};
    margin: 0;
    font-weight: 400;
    font-size: 36px;
    line-height: 1.25;

    @media ${media.gt('mobile')} {
        color: ${primary};
        font-size: 48px;
        font-weight: 300;
    }
`;

const TopTextSmall = styled(TopText)`
    font-size: 30px;
`;

const TrackingText = styled.p`
    ${fontFamilyRoboto}
    text-align: center;
    color: ${white};
    margin: 0;
    font-weight: 700;
    font-size: 24px;
    line-height: 2;

    @media ${media.gt('mobile')} {
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

    @media ${media.gt('mobile')} {
        margin-top: 2rem;
    }
`;

const StyledLink = styled(Link)`
    width: 40%;
    margin: 0 5% 1rem;
    color: ${white};

    @media ${media.gt('mobile')} {
        color: ${primary};
    }
`;

const CheckIconBox = (
    <Box py={4}>
        <SCheckIcon>
            <img src={CheckIcon} alt="Jehlomat" />
        </SCheckIcon>
    </Box>
);

const Potvrzeni: FC<Props> = ({ trackingCode }) => {
    const isLoggedIn = useRecoilValue(isLoginValidState);
    const isDesktop = useMediaQuery(media.gt('mobile'));

    return (
        <Container>
            {isDesktop && (
                <>
                    <Box alignItems="center">
                        <img src={imageSrc} height="285" alt="finish-line" />
                    </Box>
                    {CheckIconBox}
                    <Box mb="2rem">
                        <TopText>Vložení nálezu bylo úspěšné</TopText>
                    </Box>
                </>
            )}
            {!isDesktop && (
                <>
                    <Box mb="2rem">
                        <TopText>Vložení nálezu</TopText>
                        <TopTextSmall>bylo úspěšné</TopTextSmall>
                    </Box>
                    {CheckIconBox}
                </>
            )}
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
