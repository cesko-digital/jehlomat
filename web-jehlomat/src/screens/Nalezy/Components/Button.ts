import { styled } from '@mui/system';

export const Button = styled('button')({
    background: 'white',
    border: '1px solid rgba(14, 118, 108, 1)',
    borderRadius: 18,
    color: 'rgba(14, 118, 108, 1)',
    cursor: 'pointer',
    fontSize: '1rem',
    height: 36,
    minWidth: 100,
    paddingLeft: 16,
    paddingRight: 16,
    transition: 'all 300ms',

    '&:hover': {
        background: 'rgba(14, 118, 108, 0.1)',
    },

    '&:focus': {
        outline: 'none',
        boxShadow: '0 0 0 2px rgba(14, 118, 108, 0.2)',
    },
});

export default Button;
