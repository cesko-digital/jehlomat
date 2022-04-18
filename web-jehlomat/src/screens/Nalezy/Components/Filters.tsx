import React from 'react';
import { styled } from '@mui/system';

export const Filters = styled('div')(({ theme }) => ({
    background: 'rgba(47, 166, 154, 0.1)',
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

export default Filters;
