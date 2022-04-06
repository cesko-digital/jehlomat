import React from 'react';
import { styled } from '@mui/system';
import {secondaryColorVariant} from "../../../utils/colors";

export const Filters = styled('div')(({ theme }) => ({
    background: secondaryColorVariant('light'),
    borderRadius: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),

    '& > *': {
        marginRight: theme.spacing(2),

        '&:last-child': {
            marginRight: 0,
        },
    },
}));

export default Filters;
