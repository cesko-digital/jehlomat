import { FC } from 'react';
import styled from '@emotion/styled/macro';
import { primaryDark, secondary, white, secondaryColorVariant, textSubTitles } from 'utils/colors';
import { size } from 'utils/spacing';
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';

const Container = styled.div`
    display: flex;
    position: relative;
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
    margin-bottom: ${size(2)};
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
    justify-content: start;
    align-items: center;
    background: ${props => props.backgroundColor};
    flex-grow: 1;
    padding: ${size(2)};

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
        top: calc(50% - 2px);
        width: 100%;
        background-color: ${primaryDark};
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
    font-size: 12px;
    line-height: 14px;
    max-width: ${size(24)};
    color: ${textSubTitles};
    margin: 0;
`;

const StepperContainer: FC = ({ children }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    return (
        <>
            <Box minHeight={isMobile ? '100vh' : 0}>
                <Container>{children}</Container>
            </Box>
        </>
    );
};

const bgColors = [secondaryColorVariant('light'), secondaryColorVariant('regular'), secondaryColorVariant('dark')];

interface CardProps {
    currentStep: number;
    order: number;
    title: string;
}

const StepperCard: FC<CardProps> = ({ order, currentStep, title, children }) => {
    const backgroundColor = bgColors.hasOwnProperty(order) ? bgColors[order] : secondaryColorVariant('regular');
    return (
        <Card backgroundColor={backgroundColor} active={currentStep >= order} lineActive={currentStep >= order + 1}>
            <IconWrapper>
                <Icon>{children}</Icon>
            </IconWrapper>
            <Title>{title}</Title>
        </Card>
    );
};

export { StepperContainer, StepperCard };
