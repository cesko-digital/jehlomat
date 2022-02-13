import { FC, MouseEventHandler } from 'react';
import * as s from './ModalTitleBarStyles';
import { NavigationTitle } from '../../utils/typography';
import { IconButton } from '@mui/material';

interface ITitleBar {
    icon?: any | undefined;
    mobile?: boolean | undefined;
    isCentered?: boolean | undefined;
    onIconClick?: MouseEventHandler | undefined;
}

const ModalTitleBar: FC<ITitleBar> = ({ icon, mobile, isCentered, children, onIconClick }) => {
    return (
        <s.ModalContainer mobile={mobile}>
            {icon && (
                <s.ModalNavIcon mobile={mobile} onClick={onIconClick} >
                    <IconButton aria-label="Zpět">{icon}</IconButton>
                </s.ModalNavIcon>
            )}
            <s.ModalContent isCentered={isCentered}>
                <NavigationTitle>{children}</NavigationTitle>
            </s.ModalContent>
        </s.ModalContainer>
    );
};

export default ModalTitleBar;
