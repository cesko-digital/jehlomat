import { FC, MouseEventHandler } from "react";
import * as s from "./TitleBarStyles";
import { NavigationTitle } from "../Utils/Typography";
import { IconButton } from "@mui/material";

interface ITitleBar {
    icon?: any | undefined
    onIconClick?: MouseEventHandler | undefined
}

/* Usage examples:

With back chevron

    <TitleBar icon={faChevronLeft} onIconClick={(event) => {}}>Organization</TitleBar>

With just title

    <TitleBar>Home</TitleBar>

 */

const TitleBar: FC<ITitleBar> = ({ icon, children, onIconClick }) => {
    return <s.Container>
        <s.GlobalBody />
        {icon &&
            <s.NavIcon onClick={onIconClick}>
                <IconButton aria-label="Zpět">
                    {icon}
                </IconButton>
            </s.NavIcon>
        }
        <s.Content isCentered={!icon}>
            <NavigationTitle>{children}</NavigationTitle>
        </s.Content>
    </s.Container>
}

export default TitleBar