import React, {FunctionComponent} from "react";
import {ClickAwayListener, Popper} from "@mui/material";
import {VirtualElement} from "@popperjs/core";
import {ActionLink, Links} from "../NalezyStyles";
import {ReactComponent as SyringeCrossedIcon} from "assets/icons/crossed-syringe.svg";
import {ReactComponent as EditIcon} from "assets/icons/edit.svg";
import {ReactComponent as DeleteIcon} from "assets/icons/delete.svg";

interface ListItemMenuProps {
    open: boolean;
    anchorEl: VirtualElement;
    onClickAway: () => void;
}

const ListItemMenu: FunctionComponent<ListItemMenuProps> = ({ anchorEl, onClickAway, open }) => (
    <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom"
    >
      <ClickAwayListener onClickAway={onClickAway}>
          <Links>
              <ul>
                  <li>
                      <ActionLink to="/">
                          <span>Zlikvidovat nález</span>
                          <SyringeCrossedIcon style={{ width: "24px", height: "24px" }} />
                      </ActionLink>
                  </li>
                <li>
                    <ActionLink to="/">
                        <span>Upravit</span>
                        <EditIcon style={{ width: "20px", height: "20px" }} />
                    </ActionLink>
                </li>
                <li>
                    <ActionLink to="/">
                        <span>Smazat</span>
                        <DeleteIcon style={{ width: "24px", height: "24px" }} />
                    </ActionLink>
                </li>
              </ul>
          </Links>
      </ClickAwayListener>
    </Popper>
);

export default ListItemMenu;
