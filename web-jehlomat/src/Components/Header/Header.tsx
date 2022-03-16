import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { SContainer, SLinkContainer, SMobileContainer } from './HeaderStyles';
import { HeaderLink, HeaderLinkType } from './HeaderLink/HeaderLink';
import { HeaderLogo } from './HeaderLogo/HeaderLogo';
import TitleBar from '../Navigation/TitleBar';
import { LINKS, Routes } from 'routes';
import { white } from 'utils/colors';
import { ChevronLeft } from '@mui/icons-material';
import Navigator from 'Components/Navigator/Navigator';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isLoginValidState, tokenState } from 'store/login';

interface Props {
    mobileTitle: string;
    backRoute?: string;
}

export const Header = (props: Props) => {
    const history = useHistory();
    const isLoggedIn = useRecoilValue(isLoginValidState);
    const setToken = useSetRecoilState(tokenState);

    const logoutFnc = useCallback(() => {
        setToken(null);
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

    return (
        <>
            <SContainer>
                <HeaderLogo />
                <SLinkContainer>
                    <HeaderLink type={HeaderLinkType.Watch} route={LINKS.TRACKING_FIND} />
                    <HeaderLink type={HeaderLinkType.CreateOrgAccount} route={LINKS.ORGANIZATION_REGISTRATION} />
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
