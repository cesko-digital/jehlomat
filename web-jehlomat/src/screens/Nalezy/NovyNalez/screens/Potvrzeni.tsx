import { FC } from 'react';
import styled from '@emotion/styled';
import { Box } from '@mui/system';
import { useRecoilValue } from 'recoil';
import Link from 'Components/Link';

import { primary, white } from 'utils/colors';
import { H1, fontFamilyRoboto } from 'utils/typography';
import { LINKS } from 'routes';
import { isLoginValidState } from 'store/login';

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
        padding: 3rem 1rem;
        height: auto;
    }
`;

const TextContainer = styled.div`
    margin-bottom: 2rem;
`;

const TopText = styled(H1)`
    text-align: center;
    color: ${white};
    margin: 0;

    @media (min-width: 700px) {
        color: ${primary};
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
`

const LinksContainer = styled.div`
    width: 100%;
    display: flex;
    margin-top: 2rem;

    @media (min-width: 700px) {
        margin-top: 5rem;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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

    return (
        <Container>
            <TextContainer>
                <TopText>Děkujeme za vložení nálezu!</TopText>
            </TextContainer>
            { !isLoggedIn && trackingCode && (
                <>
                    <Box>
                        <TrackingText>Trasovací kód pro sledování:</TrackingText>
                        <TrackingCode>{ trackingCode }</TrackingCode>
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
