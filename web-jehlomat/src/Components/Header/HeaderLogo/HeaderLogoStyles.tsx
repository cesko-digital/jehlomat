import styled from '@emotion/styled';
import { media } from 'utils/media';
import { primary } from '../../../utils/colors';

export const Logo = styled.img`
    max-width: 200px;

    @media ${media.lte('mobile')} {
        max-width: 290px;
    }
`;

export const Container = styled.div`
    background-color: ${primary};
    max-height: 40px;
    max-width: 300px;
    padding: 1.5em 2em;

    @media ${media.lte('mobile')} {
        max-height: 100%;
        padding: 0;
    }
`;
