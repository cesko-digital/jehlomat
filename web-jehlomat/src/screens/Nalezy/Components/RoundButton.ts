import { styled } from '@mui/system';

const RoundButton = styled('button')({
    alignItems: 'center',
    background: 'white',
    border: '1px solid transparent',
    borderRadius: '50%',
    color: 'rgba(128, 130, 133, 1)',
    cursor: 'pointer',
    display: 'inline-flex',
    height: 32,
    justifyContent: 'center',
    transition: 'border 300ms',
    outline: 'none',
    width: 32,

    '&:hover': {
        borderColor: 'rgba(14, 118, 108, 1)',
    },

    '&:focus': {
        outline: 'none',
    },
});

export default RoundButton;
