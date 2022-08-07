import styled from '@emotion/styled';
import { Container as MUIContainer, Typography } from '@mui/material';
import { primaryDark } from 'utils/colors';

export const Container = styled(MUIContainer)`
    flex-grow: 1;
`;

export const Title = styled(Typography)`
    color: ${primaryDark};
    font-size: 24px;
    line-height: 28px;
    margin: 62px 0 72px;
`;
