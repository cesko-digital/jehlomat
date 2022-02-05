import styled from '@emotion/styled';
import { secondary } from '../../utils/colors';
import { size } from '../../utils/spacing';

export const SCheckIcon = styled.div`
    background-color: ${secondary};
    border-radius: 50%;
    width: ${size(17)};
    height: ${size(17)};
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: auto;
    margin-left: auto;
`;

export const SLogo = styled.img`
    margin-bottom: ${size(22)};
    min-width: ${size(72)};
`;
