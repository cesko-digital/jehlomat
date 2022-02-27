import { FC, MouseEventHandler } from 'react';
import * as s from './TitleBarStyles';
import { NavigationTitle } from '../../utils/typography';
import { IconButton } from '@mui/material';

interface ITitleBar {
    icon?: any | undefined;
    mobile?: boolean | undefined;
    onIconClick?: MouseEventHandler | undefined;
}

const TitleBar: FC<ITitleBar> = ({ icon, children, mobile, onIconClick }) => {
    return (
        <s.Container>
            {icon && (
                <s.NavIcon onClick={onIconClick}>
                    <IconButton aria-label="Zpět">{icon}</IconButton>
                </s.NavIcon>
            )}
            <s.Content isCentered>
                <NavigationTitle>{children}</NavigationTitle>
            </s.Content>
        </s.Container>
    );
};

export default TitleBar;
