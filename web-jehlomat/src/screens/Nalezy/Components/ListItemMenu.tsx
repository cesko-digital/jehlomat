import React, { FunctionComponent } from 'react';
import { ClickAwayListener, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import Links from "./Links";
import {styled} from "@mui/system";

interface ListItemMenuProps {
    open: boolean;
    anchorEl: VirtualElement;
    onClickAway: () => void;
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

const ListItemMenu: FunctionComponent<ListItemMenuProps> = ({ anchorEl, onClickAway, open }) => (
    <Popper open={open} anchorEl={anchorEl} placement="bottom">
        <ClickAwayListener onClickAway={onClickAway}>
            <Menu>
                <Links />
            </Menu>
        </ClickAwayListener>
    </Popper>
);

export default ListItemMenu;
