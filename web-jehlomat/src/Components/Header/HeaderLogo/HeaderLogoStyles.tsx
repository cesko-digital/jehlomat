import styled from '@emotion/styled';
import { primary } from '../../../utils/colors';

export const Logo = styled('img')<{ mobile?: boolean }>`
    ${props =>
        props.mobile &&
        `
    width: 80vw;
`}
`;

export const Container = styled('div')<{ mobile?: boolean }>`
    background-color: ${primary};
    ${props =>
        !props.mobile &&
        `
    float: left;
    max-height: 40px;
    max-width: 300px;
    padding: 1.5em 2em;
    `}
    ${props =>
        props.mobile &&
        `
    width: 100vw;
    max-height: 100%;
    padding: 0;
    float: none;
`}
`;
