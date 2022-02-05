import styled from '@emotion/styled';
import { Link as RouterLink } from 'react-router-dom';
import { primary } from 'utils/colors';

const linkStyles = `
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: ${primary};
`;

export const StyledRouteLink = styled(RouterLink)`
    ${linkStyles}
`;

export const StyledLink = styled.a`
    ${linkStyles}
`;
