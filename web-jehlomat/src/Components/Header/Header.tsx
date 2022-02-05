import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { SContainer, SLinkContainer, SMobileContainer } from './HeaderStyles';
import { HeaderLink, HeaderLinkType } from './HeaderLink/HeaderLink';
import { HeaderLogo } from './HeaderLogo/HeaderLogo';
import TitleBar from '../Navigation/TitleBar';
import { LINKS } from 'utils/links';
import { isLoggedIn, setToken, logout } from 'utils/login';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';

interface Props {
    mobileTitle: string;
    backRoute?: string;
}

export const Header = (props: Props) => {
    const history = useHistory();
    const isMobile = useMediaQuery(media.lte('mobile'));
    const logoutFnc = useCallback(() => {
        logout();
        window.location.reload();
    }, []);
    const loginFnc = () => {
        if (isMobile) {
            history.push(LINKS.login);
        } else {
        }
    };

    const renderLoginLogout = () => {
        const isLogged = isLoggedIn();
        if (isLogged) {
            return <HeaderLink onClick={logoutFnc}>Odhlásit</HeaderLink>;
        } else {
            return <HeaderLink onClick={loginFnc}>Přihlásit</HeaderLink>;
        }
    };

    return (
        <>
            <SContainer>
                <HeaderLogo />
                <SLinkContainer>
                    <HeaderLink type={HeaderLinkType.AboutApp} route={"/"} />
                    <HeaderLink type={HeaderLinkType.CreateOrgAccount} route={LINKS.organization} />
                    <HeaderLink type={HeaderLinkType.Login} route={"prihlaseni"} />
                </SLinkContainer>
            </SContainer>

            <SMobileContainer>
                <TitleBar>{props.mobileTitle}</TitleBar>
            </SMobileContainer>
        </>
    );
};
