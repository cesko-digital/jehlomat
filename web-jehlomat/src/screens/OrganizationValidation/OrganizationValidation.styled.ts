import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { white } from 'utils/colors';
import { size } from 'utils/spacing';

export const SResend = styled(Typography)`
    cursor: pointer;
`;

export const SMessageIcon = styled.img`
    width: ${size(33)};
    margin-bottom: auto;
`;

export const SResendDelimiter = styled(Typography)`
    position: relative;

    &::before {
        content: '';
        width: 90%;
        height: 2px;
        background-color: ${white};
        position: absolute;
        top: ${size(-3)};
        left: 5%;
    }
`;
