import { styled } from '@mui/system';

const GREEN = 'rgba(14, 118, 108, 1)';
const GREEN_LIGHT = 'rgba(14, 118, 108, 0.2)';

interface WrapperProps {
    active?: boolean;
    style?: {}
}

const ControlWrapper = styled('label', {
    shouldForwardProp: prop => prop !== 'active',
})<WrapperProps>(({ active, style }) => {
    const highlighted = {
        outline: 'none',
        borderColor: GREEN,
        boxShadow: `0 0 0 2px ${GREEN_LIGHT}`,
    };

    return {
        alignItems: 'center',
        display: 'inline-flex',
        background: 'white',
        border: `1px solid white`,
        borderRadius: 16,
        boxSizing: 'border-box',
        color: GREEN,
        flexDirection: 'row',
        height: 32,
        lineHeight: 1,
        paddingLeft: 12,
        paddingRight: 12,
        position: 'relative',
        transition: 'all 300ms',
        width: '100%',
        ...(active ? highlighted : {}),

        '&:hover': {
            borderColor: GREEN,
        },

        '&:focus-within': { ...highlighted },
        ...style
    };
});

export default ControlWrapper;
