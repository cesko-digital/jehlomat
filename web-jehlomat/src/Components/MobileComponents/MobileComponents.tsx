import styled from '@emotion/styled';
import { primary, white } from 'utils/colors';
import logo from 'assets/logo/logo-jehlomat.svg';
import { size } from 'utils/spacing';
import { FC } from 'react';

export const MobileContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: ${white};
    background-color: ${primary};
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
`;

const SNoMarginLogo = styled.img`
    min-width: ${size(72)};
`;

const SLogo = styled(SNoMarginLogo)`
    margin-bottom: ${size(22)};
`;

export const JehlomatLogo: FC = () => {
    return <SLogo src={logo} alt="Jehlomat" />;
};

export const JehlomatLogoNoMargin: FC = () => {
    return <SNoMarginLogo src={logo} alt="Jehlomat" />;
};
