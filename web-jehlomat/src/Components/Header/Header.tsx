import React, { useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { SContainer, SLinkContainer, SMobileContainer } from './HeaderStyles';
import { HeaderLink, HeaderLinkType } from './HeaderLink/HeaderLink';
import { HeaderLogo } from './HeaderLogo/HeaderLogo';
import TitleBar from '../Navigation/TitleBar';
import { LINKS, Routes } from 'routes';
import { LoginContext, useLogin } from 'utils/login';
import { white } from 'utils/colors';
import { ChevronLeft } from '@mui/icons-material';
import Navigator from 'Components/Navigator/Navigator';

interface Props {
    mobileTitle: string;
    backRoute?: string;
}

export const Header = (props: Props) => {
    const history = useHistory();
    const { token } = useContext(LoginContext);
    const { logout} = useLogin();



    const logoutFnc = useCallback(() => {
        logout();
        window.location.reload();
    }, [logout]);

    const onBack = () => {
        if (props.backRoute) {
            history.push(props.backRoute);
        }
    };

    const renderLoginLogout = () => {
        if (token) {
            return <HeaderLink onClick={logoutFnc}>Odhlásit</HeaderLink>;
        } else {
            return (
                <HeaderLink>
                    <Navigator route={Routes.LOGIN}>Přihlásit</Navigator>
                </HeaderLink>
            );
        }
    };

    return (
        <>
            <SContainer>
                <HeaderLogo />
                <SLinkContainer>
                    <HeaderLink type={HeaderLinkType.AboutApp} route={'/'} />
                    <HeaderLink type={HeaderLinkType.CreateOrgAccount} route={LINKS.ORGANIZATION} />
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
