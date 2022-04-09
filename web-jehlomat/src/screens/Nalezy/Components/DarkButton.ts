import { styled } from '@mui/system';

export const DarkButton = styled('button')({
    background: 'rgba(14, 118, 108, 1)',
    border: '1px solid rgba(14, 118, 108, 1)',
    borderRadius: 18,
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    height: 36,
    minWidth: 100,
    paddingLeft: 16,
    paddingRight: 16,
    transition: 'all 300ms',

    '&:hover': {
        background: 'rgba(14, 118, 108, 0.9)',
    },

    '&:focus': {
        outline: 'none',
        boxShadow: '0 0 0 2px rgba(14, 118, 108, 0.2)',
    },
});

export default DarkButton;
