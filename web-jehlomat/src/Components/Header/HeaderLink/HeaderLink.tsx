import React, {FC} from 'react';
import * as s from "./HeaderLinkStyles";
import { useHistory } from 'react-router-dom';

export enum HeaderLinkType {
    AboutApp,
    CreateOrgAccount,
    Watch,
    Login,

}

export interface IHeaderLink {
    type: HeaderLinkType
    route: string
    mobile?: boolean
}

export const HeaderLink: FC<IHeaderLink> = ({type, route, mobile}) => {
    let history = useHistory()

    return <s.Container mobile={mobile} onClick={ () => history.push(route) }><s.Link mobile={mobile}>{titleForType(type)}</s.Link></s.Container>
}

function titleForType(type: HeaderLinkType): string {
    switch (type) {
        case HeaderLinkType.AboutApp:
            return "O aplikaci";
        case HeaderLinkType.CreateOrgAccount:
            return "Založit organizaci";
        case HeaderLinkType.Watch:
            return "Sledovat nález";
        case HeaderLinkType.Login:
            return "Přihlásit se";

    }
}