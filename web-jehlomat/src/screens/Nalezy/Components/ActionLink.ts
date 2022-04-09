import { styled } from '@mui/system';
import { NavLink } from 'react-router-dom';

const ActionLink = styled(NavLink)({
    alignItems: 'center',
    borderRadius: 0,
    boxSizing: 'border-box',
    color: 'rgba(76, 78, 80, 1) !important',
    display: 'flex',
    fontSize: '0.825rem',
    height: 44,
    justifyContent: 'space-between',
    marginLeft: -12,
    marginRight: -12,
    padding: '0 12px',
    textDecoration: 'none',
    transition: 'all 300ms',

    '&:hover': {
        background: 'rgba(218, 218, 218, 0.35)',
        color: 'rgba(76, 78, 80, 0.7)',
    },

    svg: {
        display: 'inline-block',
        fill: 'rgba(76, 78, 80, 1)',
    },
});

export default ActionLink;
