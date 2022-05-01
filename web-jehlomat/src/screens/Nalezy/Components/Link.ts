import { styled } from '@mui/system';
import { NavLink } from 'react-router-dom';

const styles = {
    alignItems: 'center',
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    boxSizing: 'border-box',
    color: 'rgba(76, 78, 80, 1) !important',
    cursor: 'pointer',
    display: 'flex',
    fontSize: '0.825rem',
    height: 44,
    justifyContent: 'space-between',
    outline: 'none',
    paddingLeft: 12,
    paddingRight: 12,
    textDecoration: 'none',
    transition: 'all 300ms',
    width: '100%',

    '&:hover': {
        background: 'rgba(218, 218, 218, 0.35)',
        color: 'rgba(76, 78, 80, 0.7)',
    },

    svg: {
        display: 'inline-block',
        fill: 'rgba(76, 78, 80, 1)',
    },
};

export const ActionLink = styled(NavLink)({ '&': styles });
export const ActionButton = styled('button')({ '&': styles });
