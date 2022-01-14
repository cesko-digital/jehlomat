import styled from 'styled-components';
import { media } from '../../utils/media';
import { size } from '../../utils/spacing';
import { fontFamilyRoboto } from '../../utils/typography';

export const TextHeader = styled.h1`
    ${fontFamilyRoboto};
    font-size: ${size(11)};
    font-weight: 300;
    color: #fff;
    padding: ${size(11)} ${size(13)};

    @media ${media.lte('tablet')} {
        padding: ${size(8)} ${size(10)};
    }
`;
