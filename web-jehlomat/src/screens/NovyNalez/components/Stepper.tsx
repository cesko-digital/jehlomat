import { faCheck, faEdit, faMap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import styled from '@emotion/styled/macro';
import Navigation from '../../../Components/Navigation/Navigation';
import { primary, primaryDark, secondary, white } from '../../../utils/colors';
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';
import { media } from '../../../utils/media';
import { useRecoilState, useRecoilValue } from 'recoil';
import { newSyringeStepState } from 'screens/NovyNalez/components/store';
import { StepsEnum } from 'screens/NovyNalez/components/types';
import { isLoginValidState } from 'store/login';

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
    active?: boolean;
    lineActive?: boolean;
}

const ICON_WIDTH = '56px';
const ICON_BORDER_WIDTH = '3px';

const Icon = styled.div`
    background-color: ${white};
    margin: auto;
    border-radius: 50%;
    border: ${ICON_BORDER_WIDTH} solid ${primaryDark};
    width: ${ICON_WIDTH};
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const IconWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`;

export const Card = styled.div<iCard>`
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${props => props.backgroundColor};
    flex-grow: 1;
    padding: 1rem 0 0.5rem;

    ${props =>
        props.active &&
        `
        ${Icon} {
            border-color: ${secondary};
        }
    `}

    // normal line between icons
    &:not(:last-child) ${IconWrapper}:after {
        content: '';
        display: block;
        height: 2px;
        position: absolute;
        left: calc(50% + (${ICON_WIDTH} / 2) + ${ICON_BORDER_WIDTH});
        top: 50%;
        width: 100%;
        background-color: ${primary};
        transform: translateY(-50%);
        z-index: 2;
    }

    // active yellow line and yellow icon
    ${props =>
        props.lineActive &&
        `
            ${IconWrapper}:after {
                background-color: ${secondary} !important;
            }

            svg path {
                fill: white;
            }

            ${Icon} {
                background-color: ${secondary};
                border-color: white;
            }
       `}

    :nth-child(2) ${Icon}, :nth-child(3) ${Icon} {
        z-index: 3;
    }
`;

const Title = styled.h6`
    text-align: center;
    font-size: 16px;
    line-height: 18.75px;
    color: ${primaryDark};
    margin: 0.5rem 0;
`;

const Stepper: FC = ({ children }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    const [currentStep, setCurrentStep] = useRecoilState(newSyringeStepState);
    const isLoggedIn = useRecoilValue(isLoginValidState);

    return (
        <>
            <Box minHeight={isMobile ? '100vh' : 0}>
                <Container>
                    <Card backgroundColor="#BFE3E0" active={currentStep >= StepsEnum.Mapa} lineActive={currentStep >= StepsEnum.Info}>
                        <IconWrapper>
                            <Icon>
                                <FontAwesomeIcon icon={faMap} size="2x" color={primaryDark} />
                            </Icon>
                        </IconWrapper>
                        <Title>Přidat do mapy</Title>
                    </Card>
                    <Card backgroundColor="#CDEAE7" active={currentStep >= StepsEnum.Info} lineActive={currentStep >= StepsEnum.Potvrzeni}>
                        <IconWrapper>
                            <Icon>
                                <FontAwesomeIcon icon={faEdit} size="2x" color={primaryDark} />
                            </Icon>
                        </IconWrapper>
                        <Title>Podrobnosti o nálezu</Title>
                    </Card>
                    <Card backgroundColor="#DEF1EF" active={currentStep >= StepsEnum.Potvrzeni}>
                        <IconWrapper>
                            <Icon>
                                <FontAwesomeIcon icon={faCheck} size="2x" color={primaryDark} />
                            </Icon>
                        </IconWrapper>
                        <Title>Úspěšné vložení nálezu</Title>
                    </Card>
                    {children}
                </Container>
                {isLoggedIn && <Navigation />}
            </Box>
        </>
    );
};

export default Stepper;
