import React, { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { SContainer, SLinkContainer, SMobileContainer } from './HeaderStyles';
import { HeaderLink, HeaderLinkType } from './HeaderLink/HeaderLink';
import { HeaderLogo } from './HeaderLogo/HeaderLogo';
import TitleBar from '../Navigation/TitleBar';
import { LINKS, LINKS_WITH_PARAMS, Routes } from 'routes';
import { white } from 'utils/colors';
import { ChevronLeft } from '@mui/icons-material';
import Navigator from 'Components/Navigator/Navigator';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isLoginValidState, tokenState } from 'store/login';
import { userState } from 'store/user';
import { clearApiToken } from 'config/baseURL';

interface Props {
    mobileTitle: string;
    backRoute?: string;
}

export const Header = (props: Props) => {
    const history = useHistory();
    const isLoggedIn = useRecoilValue(isLoginValidState);
    const setToken = useSetRecoilState(tokenState);
    const loggedUser = useRecoilValue(userState);

    const logoutFnc = useCallback(() => {
        setToken(null);
        clearApiToken();
        history.push('/');
    }, [setToken]);

    const onBack = () => {
        if (props.backRoute) {
            history.push(props.backRoute);
        }
    };

    const renderLoginLogout = () => {
        if (isLoggedIn) {
            return <HeaderLink onClick={logoutFnc}>Odhlásit</HeaderLink>;
        } else {
            return (
                <HeaderLink>
                    <Navigator route={Routes.LOGIN}>Přihlásit</Navigator>
                </HeaderLink>
            );
        }
    };

    const renderUserNavigation = () => {
        if (isLoggedIn) {
            if (loggedUser && loggedUser?.isAdmin) {
                    return (
                        <>
                            <HeaderLink type={HeaderLinkType.NewFind} route={LINKS_WITH_PARAMS.NEW_FIND?.(0)} />
                            <HeaderLink type={HeaderLinkType.Findings} route={LINKS.FINDINGS} />
                            <HeaderLink type={HeaderLinkType.User} route={LINKS.USER} />
                            <HeaderLink type={HeaderLinkType.ShowOrgAccount} route={LINKS.PROFILE} />
                            {renderLoginLogout()}
                        </>
                    )
                
            } else {
                    return (
                        <>
                            <HeaderLink type={HeaderLinkType.NewFind} route={LINKS_WITH_PARAMS.NEW_FIND?.(0)} />
                            <HeaderLink type={HeaderLinkType.Findings} route={LINKS.FINDINGS} />
                            <HeaderLink type={HeaderLinkType.ShowUserAccount} route={LINKS.PROFILE} />
                            {renderLoginLogout()}
                        </>
                    ); 
                
            }
        //neprihlaseny    
        } else {
            return (
                    <>
                        <HeaderLink type={HeaderLinkType.Watch} route={LINKS.TRACKING_FIND} />
                        <HeaderLink type={HeaderLinkType.CreateOrgAccount} route={LINKS.ORGANIZATION_REGISTRATION} />
                        {renderLoginLogout()}
                    </>
            );
        }
    };

    return (
        <>
            <SContainer>
                <Link to={LINKS.HOME}>
                    <HeaderLogo />
                </Link>
                <SLinkContainer>
                    {renderUserNavigation()}
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
