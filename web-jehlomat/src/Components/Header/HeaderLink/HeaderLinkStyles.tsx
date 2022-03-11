import styled from '@emotion/styled';
import { media } from 'utils/media';

export const Container = styled('div')<{ mobile?: boolean }>`
    align-self: center;
    border-right: 1px solid #fff;

    @media ${media.lte('mobile')} {
        max-width: 6em;
        border-right: none;
    }

    padding: 5px 15px;

    &:last-child {
        border-right: none;
    }
`;

export const Link = styled('div')<{ mobile?: boolean }>`
    cursor: pointer;
    font-weight: 400;

    @media ${media.gt('mobile')} {
        text-transform: uppercase;
        text-align: right;
    }
`;
