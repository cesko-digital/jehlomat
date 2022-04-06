import React, { FunctionComponent } from 'react';
import { ClickAwayListener, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { ReactComponent as SyringeCrossedIcon } from 'assets/icons/crossed-syringe.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { styled } from '@mui/system';
import { NavLink } from 'react-router-dom';

const ActionLink = styled(NavLink)({
    alignItems: 'center',
    borderRadius: 9,
    boxSizing: 'border-box',
    color: 'rgba(76, 78, 80, 1)',
    display: 'flex',
    height: 44,
    justifyContent: 'space-between',
    margin: 0,
    padding: '0 12px',
    textDecoration: 'none',
    transition: 'all 300ms',

    '&:hover': {
        background: 'rgba(218, 218, 218, 0.5)',
        color: 'rgba(76, 78, 80, 0.7)',
    },

    svg: {
        display: 'inline-block',
    },
});

const Links = styled('nav')({
    background: 'white',
    borderRadius: 9,
    boxShadow: '0 6px 12px rgb(0 0 0 / 10%)',
    margin: 0,
    padding: 0,
    width: 192,

    '& > ul': {
        margin: 0,
        padding: 0,
        listStyle: 'none',

        li: {
            position: 'relative',

            '&:after': {
                content: "''",
                background: 'rgba(33, 33, 33, 0.08)',
                display: 'block',
                position: 'absolute',
                bottom: 0,
                height: 1,
                width: '90%',
                left: '50%',
                transform: 'translateX(-50%)',
            },

            '&:last-of-type': {
                '&:after': {
                    display: 'none',
                },
            },
        },
    },
});

interface ListItemMenuProps {
    open: boolean;
    anchorEl: VirtualElement;
    onClickAway: () => void;
}

const ListItemMenu: FunctionComponent<ListItemMenuProps> = ({ anchorEl, onClickAway, open }) => (
    <Popper open={open} anchorEl={anchorEl} placement="bottom">
        <ClickAwayListener onClickAway={onClickAway}>
            <Links>
                <ul>
                    <li>
                        <ActionLink to="/">
                            <span>Zlikvidovat nález</span>
                            <SyringeCrossedIcon style={{ width: '24px', height: '24px' }} />
                        </ActionLink>
                    </li>
                    <li>
                        <ActionLink to="/">
                            <span>Upravit</span>
                            <EditIcon style={{ width: '20px', height: '20px' }} />
                        </ActionLink>
                    </li>
                    <li>
                        <ActionLink to="/">
                            <span>Smazat</span>
                            <DeleteIcon style={{ width: '24px', height: '24px' }} />
                        </ActionLink>
                    </li>
                </ul>
            </Links>
        </ClickAwayListener>
    </Popper>
);

export default ListItemMenu;
