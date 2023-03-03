import React, { FC } from 'react';
import * as s from './HeaderLinkStyles';
import { useHistory } from 'react-router-dom';
import { isFunction } from 'formik';

export enum HeaderLinkType {
    AboutApp,
    CreateOrgAccount,
    ShowOrgAccount,
    ShowUserAccount,
    User,
    Watch,
    NewFind,
    Findings,
    Login,
    Organizations,
}

export interface IHeaderLink {
    type?: HeaderLinkType;
    route?: string;
    mobile?: boolean;
    onClick?: () => void;
    underline?: boolean;
}

export const HeaderLink: FC<IHeaderLink> = ({ type, children, route, mobile, onClick, underline = false }) => {
    let history = useHistory();

    return (
        <s.Container
            mobile={mobile}
            onClick={() => {
                route && history.push(route);
                isFunction(onClick) && onClick();
            }}
        >
            <s.Link mobile={mobile} style={{ textDecoration: underline ? 'underline' : 'initial' }}>
                {type ? titleForType(type) : children}
            </s.Link>
        </s.Container>
    );
};

function titleForType(type: HeaderLinkType): string {
    switch (type) {
        case HeaderLinkType.AboutApp:
            return 'O aplikaci';
        case HeaderLinkType.CreateOrgAccount:
            return 'Registrovat organizaci';
        case HeaderLinkType.ShowOrgAccount:
            return 'Moje Organizace';
        case HeaderLinkType.ShowUserAccount:
            return 'Profil';
        case HeaderLinkType.User:
            return 'Uživatelé';
        case HeaderLinkType.Watch:
            return 'Sledovat nález';
        case HeaderLinkType.NewFind:
            return 'Zadat nález';
        case HeaderLinkType.Findings:
            return 'Nálezy';
        case HeaderLinkType.Login:
            return 'Přihlásit se';
        case HeaderLinkType.Organizations:
            return 'Seznam organizací';
    }
}
