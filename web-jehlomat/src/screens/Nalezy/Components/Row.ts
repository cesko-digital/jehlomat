import { Syringe } from '../types/Syringe';
import { styled } from '@mui/system';
import bg from './utils/bg';
import highlight from './utils/highlight';

interface RowProps {
    syringe: Syringe;
}

const Row = styled('tr', {
    shouldForwardProp: prop => prop !== 'syringe',
})<RowProps>(({ syringe }) => ({
    background: 'white',
    border: '2px solid white',
    boxSizing: 'border-box',
    borderRadius: 8,
    minHeight: 50,
    height: 50,
    marginBottom: 10,

    '&:hover > td': {
        background: 'rgba(14, 118, 108, 0.1) !important',
        borderColor: 'rgba(14, 118, 108, 1) !important',
    },

    td: {
        background: bg(syringe),
        borderTop: `1px solid ${highlight(syringe)}`,
        borderBottom: `1px solid ${highlight(syringe)}`,
        color: 'black',
        letterSpacing: '0.15px',
        lineHeight: 1.5,
        fontSize: '0.875rem',
        fontStyle: 'normal',
        fontWeight: 'normal',
        transition: 'all 300ms',

        '& > svg': {
            fill: 'rgba(76, 78, 80, 1)',
            position: 'relative',
            top: 2,
        },

        '&:first-of-type': {
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            borderLeft: `1px solid ${highlight(syringe)}`,
            paddingLeft: 14,
        },

        '&:last-of-type': {
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            borderRight: `1px solid ${highlight(syringe)}`,
        },
    },
}));

export default Row;
