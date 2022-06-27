import React, { FunctionComponent, useCallback } from 'react';
import { VirtualElement } from '@popperjs/core';
import { ClickAwayListener, Popper } from '@mui/material';
import { styled } from '@mui/system';
import Links from 'screens/Nalezy/Components/Links';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import { useSetRecoilState } from 'recoil';
import { loaderState } from 'screens/Nalezy/store';
import dayjs from 'dayjs';

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

const ListItemMenu: FunctionComponent<ListItemMenuProps> = ({ anchorEl, onClickAway, open, syringe }) => {
    const setLoader = useSetRecoilState(loaderState);

    const onDemolishSuccess = useCallback((id: string) => {
        setLoader(loader => {
            if(!loader.resp?.syringeList) {
                return loader;
            }
            const syringeListUpdate = loader.resp?.syringeList.map(syringe => {
                if (syringe.id === id) {
                    return { ...syringe, demolishedAt: dayjs().unix(), demolished: true };
                }
                return syringe;
            });

            return {
                ...loader,
                resp: {
                    ...loader.resp,
                    syringeList: syringeListUpdate,
                }
            };
        });
    }, []);

    return (
        <Popper open={open} anchorEl={anchorEl} placement="bottom">
            <ClickAwayListener onClickAway={onClickAway}>
                <Menu>
                    <Links onClose={onClickAway} syringe={syringe} onDemolishSuccess={onDemolishSuccess} />
                </Menu>
            </ClickAwayListener>
        </Popper>
    );
};

export default ListItemMenu;
