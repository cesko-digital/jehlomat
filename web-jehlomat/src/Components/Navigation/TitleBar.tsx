import {FC, MouseEventHandler} from "react";
import * as s from "./TitleBarStyles"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {NavigationTitle} from "../Utils/Typography";

interface ITitleBar {
    icon?: IconDefinition | undefined
    onIconClick?: MouseEventHandler | undefined
}

/* Usage examples:

With back chevron

    <TitleBar icon={faChevronLeft} onIconClick={(event) => {}}>Organization</TitleBar>

With just title

    <TitleBar>Home</TitleBar>

 */

const TitleBar: FC<ITitleBar> = ({icon, children, onIconClick}) => {
    return <s.Container>
        <s.GlobalBody/>
        {icon &&
        <s.NavIcon onClick={onIconClick}>
            <FontAwesomeIcon icon={icon} inverse/>
        </s.NavIcon>
        }
        <s.Content isCentered={!icon}>
            <NavigationTitle>{children}</NavigationTitle>
        </s.Content>
    </s.Container>
}

export default TitleBar