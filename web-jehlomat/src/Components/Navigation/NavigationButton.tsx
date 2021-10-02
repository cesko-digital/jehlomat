import {FC} from "react";
import {AddSyringeIcon} from "../../assets/AddSyringeIcon";
import {ProfileIcon} from "../../assets/ProfileIcon";
import {UsersIcon} from "../../assets/UsersIcon";
import {ListIcon} from "../../assets/ListIcon"
import * as s from "./NavigationStyles"
import {useHistory} from "react-router-dom";

export enum NavigationButtonType {
    Profile,
    SyringeList,
    Users,
}

interface ISecondaryNavigationButton {
    type: NavigationButtonType
    selected: boolean
    route: string
}

export const SecondaryNavigationButton: FC<ISecondaryNavigationButton> = ({type, selected, route}) => {
    let history = useHistory()

    return <s.SecondaryNavigationButtonContainer onClick={ () => history.push(route) }>
        <s.SecondaryNavigationButtonIcon selected={selected}>
            {iconForType(type)}
        </s.SecondaryNavigationButtonIcon>
        <s.SecondaryNavigationButtonTitle selected={selected}>{titleForType(type)}</s.SecondaryNavigationButtonTitle>
    </s.SecondaryNavigationButtonContainer>
}

interface IPrimaryNavigationButton {

}

export const PrimaryNavigationButton: FC<IPrimaryNavigationButton> = ({}) => {
    return <AddSyringeIcon />
}

function iconForType(type: NavigationButtonType) {
    switch (type) {
        case NavigationButtonType.Profile:
            return <ProfileIcon/>;
        case NavigationButtonType.Users:
            return <UsersIcon/>;
        case NavigationButtonType.SyringeList:
            return <ListIcon/>;
    }
}

function titleForType(type: NavigationButtonType): string {
    switch (type) {
        case NavigationButtonType.Profile:
            return "Profil";
        case NavigationButtonType.Users:
            return "Uživatelé";
        case NavigationButtonType.SyringeList:
            return "List nálezů";
    }
}
