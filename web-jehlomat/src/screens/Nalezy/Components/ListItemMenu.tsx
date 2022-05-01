import React, { FunctionComponent } from 'react';
import { VirtualElement } from '@popperjs/core';
import { ClickAwayListener, Popper } from '@mui/material';
import { styled } from '@mui/system';
import Links from 'screens/Nalezy/Components/Links';
import { Syringe } from 'screens/Nalezy/types/Syringe';

interface ListItemMenuProps {
    open: boolean;
    anchorEl: VirtualElement;
    onClickAway: () => void;
    syringe: Syringe;
}

const Menu = styled('nav')({
    background: 'white',
    border: '1px solid #dee2e6',
    borderRadius: 8,
    boxShadow: '0 4px 16px rgb(0 0 0 / 10%)',
    margin: 0,
    padding: 0,
    width: 192,
    overflow: 'hidden',
});

const ListItemMenu: FunctionComponent<ListItemMenuProps> = ({ anchorEl, onClickAway, open, syringe }) => (
    <Popper open={open} anchorEl={anchorEl} placement="bottom">
        <ClickAwayListener onClickAway={onClickAway}>
            <Menu>
                <Links onClose={onClickAway} syringe={syringe} />
            </Menu>
        </ClickAwayListener>
    </Popper>
);

export default ListItemMenu;
