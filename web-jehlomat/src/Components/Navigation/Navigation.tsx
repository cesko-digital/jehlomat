import React, { FC } from 'react';
import * as s from './NavigationStyles';
import { NavigationButtonType, PrimaryNavigationButton, SecondaryNavigationButton } from './NavigationButton';
import { Link, useLocation } from 'react-router-dom';
import { LINKS, ORGANIZATION_URL_PATH } from 'routes';
import { css, GlobalStyles } from '@mui/styled-engine';
import { useRecoilValue } from 'recoil';
import { userState } from 'store/user';

const Navigation: FC = () => {
    const location = useLocation();
    const loggedUser = useRecoilValue(userState);

    const renderUserNavigation = () => {
        if (loggedUser && loggedUser.isSuperAdmin) {
            return (
                <>
                    <SecondaryNavigationButton route={LINKS.ORGANIZATIONS} selected={location.pathname === LINKS.ORGANIZATIONS} type={NavigationButtonType.Organizations} />
                    <SecondaryNavigationButton route={LINKS.FINDINGS_MAPA} selected={location.pathname === LINKS.FINDINGS_MAPA} type={NavigationButtonType.Map} />
                    <SecondaryNavigationButton route={LINKS.FINDINGS} selected={location.pathname === LINKS.FINDINGS} type={NavigationButtonType.SyringeList} />
                </>
            );
        } else if (loggedUser && loggedUser.isAdmin) {
            const organizationUrl = `/${ORGANIZATION_URL_PATH}/${loggedUser.organizationId}`;
            return (
                <>
                    <SecondaryNavigationButton route={LINKS.USER} selected={location.pathname === LINKS.USER} type={NavigationButtonType.Users} />
                    <SecondaryNavigationButton route={LINKS.FINDINGS} selected={location.pathname === LINKS.FINDINGS} type={NavigationButtonType.SyringeList} />
                    <SecondaryNavigationButton route={LINKS.PROFILE} selected={location.pathname === LINKS.PROFILE} type={NavigationButtonType.Profile} />
                    <SecondaryNavigationButton route={organizationUrl} selected={location.pathname === organizationUrl} type={NavigationButtonType.Organization} />
                </>
            );
        }
        return (
            <>
                <SecondaryNavigationButton route={LINKS.FINDINGS} selected={location.pathname === LINKS.FINDINGS} type={NavigationButtonType.SyringeList} />
                <SecondaryNavigationButton route={LINKS.FINDINGS_MAPA} selected={location.pathname === LINKS.FINDINGS_MAPA} type={NavigationButtonType.Map} />
                <SecondaryNavigationButton route={LINKS.PROFILE} selected={location.pathname === LINKS.PROFILE} type={NavigationButtonType.Profile} />
            </>
        );
    };

    return (
        <s.Container>
            <GlobalStyles
                styles={css`
                    body {
                        padding-bottom: 86px;
                    }
                `}
            />
            <s.LeftBar>{renderUserNavigation()}</s.LeftBar>
            <Link to={LINKS.NEW_FIND_INIT}>
                <s.PrimaryBar>
                    <PrimaryNavigationButton />
                </s.PrimaryBar>
            </Link>
        </s.Container>
    );
};

export default Navigation;
