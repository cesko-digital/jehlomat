import { faCheck, faEdit, faMap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import styled from '@emotion/styled';
import PrimaryButton from '../../../Components/Buttons/PrimaryButton/PrimaryButton';
import Navigation from '../../../Components/Navigation/Navigation';
import { primaryDark, white } from '../../../utils/colors';
import { Header } from '../../../Components/Header/Header';
import whiteArrow from 'assets/images/white-arrow.png';
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';
import { media } from '../../../utils/media';

const Container = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    height: 100%;

    flex-direction: row;
    padding-bottom: 4rem;
`;
interface iCard {
    backgroundColor: string;
}

export const Card = styled.div<iCard>`
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${props => props.backgroundColor};
    flex-grow: 1;
    padding: 1rem 0 0.5rem;

    &:last-child {
        display: none;
        background-color: red;
    }
`;

const Icon = styled.div`
    background-color: ${white};
    margin: auto;
    border-radius: 50%;
    border: 3px solid ${primaryDark};
    width: 56px;
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h6`
    text-align: center;
    font-size: 16px;
    line-height: 18.75px;
    color: ${primaryDark};
    margin: 0.5rem 0;
`;

const Info: FC = ({ children }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    return (
        <>
            <Box minHeight={isMobile ? '100vh' : 0}>
                <Container>
                    <Card backgroundColor="#BFE3E0">
                        <Icon>
                            <FontAwesomeIcon icon={faMap} size="2x" color={primaryDark} />
                        </Icon>
                        <Title>Přidat do mapy</Title>
                    </Card>
                    <Card backgroundColor="#CDEAE7">
                        <Icon>
                            <FontAwesomeIcon icon={faEdit} size="2x" color={primaryDark} />
                        </Icon>
                        <Title>Přidat podrobnosti do mapy</Title>
                    </Card>
                    <Card backgroundColor="#DEF1EF">
                        <Icon>
                            <FontAwesomeIcon icon={faCheck} size="2x" color={primaryDark} />
                        </Icon>
                        <Title>Úspěšné vložení nálezu</Title>
                    </Card>
                    {children}
                    <Navigation></Navigation>
                </Container>
            </Box>
        </>
    );
};

export default Info;
