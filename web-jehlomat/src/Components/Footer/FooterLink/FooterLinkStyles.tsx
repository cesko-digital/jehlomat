import styled from '@emotion/styled';
import { white } from '../../../utils/colors';

export const Container = styled.div`
    text-transform: uppercase;
    align-self: center;
    border-right: 1px solid #fff;
    padding: 5px 15px;
    font-size: 0.87em;
    line-height: 16px;
    letter-spacing: 1.25px;
    color: ${white};
    &:last-child {
        border-right: none;
    }
`;

export const Link = styled.div`
    align-content: center;
    text-align: left;
    cursor: pointer;
`;
