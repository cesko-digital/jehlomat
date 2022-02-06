import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { SContainer, SLinkContainer, SMobileContainer } from './HeaderStyles';
import { HeaderLink, HeaderLinkType } from './HeaderLink/HeaderLink';
import { HeaderLogo } from './HeaderLogo/HeaderLogo';
import TitleBar from '../Navigation/TitleBar';
import { LINKS, Routes } from 'routes';
import { isLoggedIn, logout } from 'utils/login';
import { white } from 'utils/colors';
import { ChevronLeft } from '@mui/icons-material';
import Navigator from 'Components/Navigator/Navigator';

interface Props {
    mobileTitle: string;
    backRoute?: string;
}

<<<<<<< HEAD
=======

>>>>>>> 769feff (feat: routes with modal)
export const Header = (props: Props) => {
    const history = useHistory();

    const logoutFnc = useCallback(() => {
        logout();
        window.location.reload();
    }, []);

    const onBack = () => {
        if (props.backRoute) {
            history.push(props.backRoute);
        }
    };

    const renderLoginLogout = () => {
        const isLogged = isLoggedIn();

        if (isLogged) {
            return <HeaderLink onClick={logoutFnc}>Odhlásit</HeaderLink>;
        } else {
            return (
                <HeaderLink>
<<<<<<< HEAD
                    <Navigator to={LINKS.login} modal={<></>}>
                        Přihlásit
                    </Navigator>
=======
                    <Navigator route={Routes.LOGIN}>Přihlásit</Navigator>
>>>>>>> 769feff (feat: routes with modal)
                </HeaderLink>
            );
        }
    };

    return (
        <>
            <SContainer>
                <HeaderLogo />
                <SLinkContainer>
<<<<<<< HEAD
                    <HeaderLink type={HeaderLinkType.CreateOrgAccount} route={LINKS.organizationRegistration} />
                    <HeaderLink type={HeaderLinkType.Watch} route={LINKS.findings} />

=======
                    <HeaderLink type={HeaderLinkType.AboutApp} route={'/'} />
                    <HeaderLink type={HeaderLinkType.CreateOrgAccount} route={LINKS.ORGANIZATION} />
>>>>>>> 769feff (feat: routes with modal)
                    {renderLoginLogout()}
                </SLinkContainer>
            </SContainer>

            <SMobileContainer>
                <TitleBar icon={props.backRoute && <ChevronLeft sx={{ color: white, fontSize: 40 }} />} onIconClick={() => onBack()}>
                    {props.mobileTitle}
                </TitleBar>
            </SMobileContainer>
        </>
    );
};
