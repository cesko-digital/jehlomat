import { FC } from 'react';
import styled from '@emotion/styled';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import { Box } from '@mui/system';
import { useRecoilValue } from 'recoil';
import Link from 'Components/Link';

import { primary, white } from 'utils/colors';
import { H1, H4 } from 'utils/typography';
import { LINKS } from 'routes';
import { isLoginValidState } from 'store/login';

interface Props {}

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

const Title = styled.h2`
    font-size: 52px;
    color: ${white};
    text-align: center;
    margin: 1rem 0;

    @media (min-width: 700px) {
        color: ${primary};
    }
`;

const TopText = styled(H1)`
    text-align: center;
    color: ${white};
    margin: 0;

    @media (min-width: 700px) {
        color: ${primary};
    }
`;

const SecondaryText = styled(H4)`
    text-align: center;
    color: ${white};
    margin: 0;

    @media (min-width: 700px) {
        color: ${primary};
    }
`;

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

const Potvrzeni: FC<Props> = () => {
    const isLoggedIn = useRecoilValue(isLoginValidState);

    return (
        <Container>
            <TextContainer>
                <TopText>Děkujeme za vložení nálezu!</TopText>
                <Title>jehlomat</Title>
                <SecondaryText>Nález bude zlikvidován terénním pracovníkem.</SecondaryText>
            </TextContainer>
            { !isLoggedIn && (
                <>
                    <Box>
                        <SecondaryButton text="ULOŽIT NÁZEV" />
                    </Box>
                    <LinksContainer>
                        <StyledLink>Chci zaslat potvrzení o likvidaci nálezu</StyledLink>
                        <StyledLink to={LINKS.FINDINGS_NOTIFY_POLICE}>Chci nález zlikvidovat sám</StyledLink>
                    </LinksContainer>
                </>
            )}
        </Container>
    );
};

export default Potvrzeni;
