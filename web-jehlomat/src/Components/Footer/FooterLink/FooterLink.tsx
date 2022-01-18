import React, { FC } from 'react';
import * as s from './FooterLinkStyles';
import { useHistory } from 'react-router-dom';

export enum FooterLinkType {
    AboutApp,
    AboutJehlomat,
    Contact,
}

export interface IFooterLink {
    type: FooterLinkType;
    route: string;
}

export const FooterLink: FC<IFooterLink> = ({ type, route }) => {
    let history = useHistory();

    return (
        <s.Container onClick={() => history.push(route)}>
            <s.Link>{titleForType(type)}</s.Link>
        </s.Container>
    );
};

function titleForType(type: FooterLinkType): string {
    switch (type) {
        case FooterLinkType.AboutApp:
            return 'O aplikaci';
        case FooterLinkType.AboutJehlomat:
            return 'O jehlomatu';
        case FooterLinkType.Contact:
            return 'Kontakt';
    }
}
