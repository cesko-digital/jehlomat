import styled from '@emotion/styled';
import { primaryDark } from '../../../utils/colors';

export const IconWrapper = styled.span`
    position: absolute;
    right: 20px;
    top: 38px; // static position cause input with error text has bigger height than without
    color: ${primaryDark};
`;
