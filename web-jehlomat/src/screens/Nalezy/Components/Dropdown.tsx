import React, {FunctionComponent} from "react";
import styled from "@emotion/styled";
import {white} from "../../../utils/colors";
import {VirtualElement} from "@popperjs/core";
import {ClickAwayListener, Popper} from "@mui/material";

interface DropdownProps {
  open: boolean;
  anchorEl: VirtualElement | null;
  onClickAway: () => void;
}

const Background = styled.div`
    background: ${white};
    border-radius: 9px;
    box-shadow: 0 6px 12px rgb(0 0 0 / 10%);
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 4px;
`;

export const Dropdown: FunctionComponent<DropdownProps> = ({ anchorEl, onClickAway, open, children }) => (
  <Popper
    open={open}
    anchorEl={anchorEl}
    placement="bottom"
  >
    <ClickAwayListener onClickAway={onClickAway}>
      <Background>
        {children}
      </Background>
    </ClickAwayListener>
  </Popper>
);