import React, { FC } from 'react';
import * as s from './HeaderLinkStyles';
import { useHistory } from 'react-router-dom';
import { isFunction } from 'formik';

export enum HeaderLinkType {
    AboutApp,
    CreateOrgAccount,
    Watch,
    Findings,
    Login,
}

export interface IHeaderLink {
    type?: HeaderLinkType;
    route?: string;
    mobile?: boolean;
    onClick?: () => void;
}

export const HeaderLink: FC<IHeaderLink> = ({ type, children, route, mobile, onClick }) => {
    let history = useHistory();

    return (
        <s.Container
            mobile={mobile}
            onClick={() => {
                route && history.push(route);
                isFunction(onClick) && onClick();
            }}
        >
            <s.Link mobile={mobile}>{type ? titleForType(type) : children}</s.Link>
        </s.Container>
    );
};

function titleForType(type: HeaderLinkType): string {
    switch (type) {
        case HeaderLinkType.AboutApp:
            return 'O aplikaci';
        case HeaderLinkType.CreateOrgAccount:
            return 'Založit organizaci';
        case HeaderLinkType.Watch:
            return 'Sledovat nález';
        case HeaderLinkType.Findings:
            return 'Nálezy';
        case HeaderLinkType.Login:
            return 'Přihlásit se';
    }
}
