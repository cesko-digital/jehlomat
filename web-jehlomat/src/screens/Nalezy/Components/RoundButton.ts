import { styled } from '@mui/system';

interface RoundButtonProps {
    filled?: boolean;
}

const RoundButton = styled('button', {
    shouldForwardProp: prop => prop !== 'filled',
})<RoundButtonProps>(({ filled }) => ({
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
    ...(filled ? ({
        background: 'rgba(14, 118, 108, 1)',
        color: 'white',
    }) : {}),

    '&:hover': {
        borderColor: 'rgba(14, 118, 108, 1)',
    },

    '&:focus': {
        outline: 'none',
    },
}));

export default RoundButton;
