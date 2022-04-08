import React from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/system';
import { ReactComponent as SyringeIcon } from 'assets/icons/syringe-line.svg';
import { ReactComponent as EditIcon } from 'assets/icons/pencil-line.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete-bin-line.svg';

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

    '&.danger': {
        color: 'rgba(220, 53, 69, 1) !important',

        '&:hover': {
            background: 'rgba(220, 53, 69, 0.075)',
        },

        svg: {
            fill: 'rgba(220, 53, 69, 1)',
        },
    },

    svg: {
        display: 'inline-block',
        fill: 'rgba(76, 78, 80, 1)',
    },
});

const List = styled('ul')({
    margin: 0,
    padding: 0,
    listStyle: 'none',

    li: {
        borderBottom: '1px solid #dee2e6',
        marginLeft: 12,
        marginRight: 12,

        '&:last-child': {
            borderBottom: 'none',
        },
    },
});

const Links = () => (
    <List>
        <li>
            <ActionLink to="/">
                <span>Zlikvidovat nález</span>
                <SyringeIcon style={{ width: '20px', height: '20px' }} />
            </ActionLink>
        </li>
        <li>
            <ActionLink to="/">
                <span>Upravit</span>
                <EditIcon style={{ width: '20px', height: '20px' }} />
            </ActionLink>
        </li>
        <li>
            <ActionLink className="danger" to="/">
                <span>Smazat</span>
                <DeleteIcon style={{ width: '20px', height: '20px' }} />
            </ActionLink>
        </li>
    </List>
);

export default Links;
