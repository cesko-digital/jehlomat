import React, {FC} from 'react';
import * as s from "./HeaderLinkStyles";
import { useHistory } from 'react-router-dom';

export enum HeaderLinkType {
    AboutApp,
    CreateOrgAccount,
    Login,
}

export interface IHeaderLink {
    type: HeaderLinkType
    route: string
}

export const HeaderLink: FC<IHeaderLink> = ({type, route}) => {
    let history = useHistory()

    return <s.Container onClick={ () => history.push(route) }><s.Link>{titleForType(type)}</s.Link></s.Container>
}

function titleForType(type: HeaderLinkType): string {
    switch (type) {
        case HeaderLinkType.AboutApp:
            return "O aplikaci";
        case HeaderLinkType.CreateOrgAccount:
            return "Založit účet organizaci";
        case HeaderLinkType.Login:
            return "Přihlásit se";
    }
}