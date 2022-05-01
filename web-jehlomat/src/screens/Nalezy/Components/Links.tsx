import React, { FunctionComponent, useCallback } from 'react';
import { styled } from '@mui/system';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import { ActionButton, ActionLink } from 'screens/Nalezy/Components/Link';
import Delete from 'screens/Nalezy/Components/Delete';

import { ReactComponent as SyringeIcon } from 'assets/icons/syringe-line.svg';
import { ReactComponent as EditIcon } from 'assets/icons/pencil-line.svg';
import { AxiosResponse } from "axios";
import { API } from 'config/baseURL';
import dayjs from "dayjs";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "store/user";
import { paginationState } from "../store";

const List = styled('ul')({
    margin: 0,
    padding: 0,
    listStyle: 'none',

    li: {
        borderBottom: '1px solid #dee2e6',
        margin: 0,

        '&:last-child': {
            borderBottom: 'none',
        },
    },
});

interface LinksProps {
    syringe: Syringe;
    onClose?: () => void;
}

const Links: FunctionComponent<LinksProps> = ({ syringe, onClose }) => {
    const auth = useRecoilValue(userState);
    const setPaging = useSetRecoilState(paginationState);

    const handleDemolish = useCallback((ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();

        const payload = {
            ...syringe,
            demolishedAt: +dayjs(),
            demolishedBy: {
                id: auth?.id
            }
        };

        API
        .put(`/syringe`, payload)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) throw new Error('Unable to delete syringe');
        })
        .catch(e => console.warn(e))
        .finally(() => {
            if (typeof onClose === "function") onClose();

            setPaging(state => ({ ...state }));
        });
    }, [syringe]);

    return (
        <List>
            <li>
                <ActionButton onClick={handleDemolish}>
                    <span>Zlikvidovat nález</span>
                    <SyringeIcon style={{width: '20px', height: '20px'}}/>
                </ActionButton>
            </li>
            {/*<li>*/}
            {/*    <ActionLink to="/">*/}
            {/*        <span>Upravit</span>*/}
            {/*        <EditIcon style={{width: '20px', height: '20px'}}/>*/}
            {/*    </ActionLink>*/}
            {/*</li>*/}
            <li>
                <Delete syringe={syringe}/>
            </li>
        </List>
    );
}

export default Links;
