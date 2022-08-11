import styled from '@emotion/styled';
import { primary, white } from 'utils/colors';
import logo from 'assets/logo/logo-jehlomat.svg';
import { size } from 'utils/spacing';

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

const SLogo = styled.img`
    margin-bottom: ${size(22)};
    min-width: ${size(72)};
`;

export const JehlomatLogo = () => {
    return <SLogo src={logo} alt="Jehlomat" />;
};
