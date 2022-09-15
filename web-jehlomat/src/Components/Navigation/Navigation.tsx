import React, { FC } from 'react';
import * as s from './NavigationStyles';
import { NavigationButtonType, PrimaryNavigationButton, SecondaryNavigationButton } from './NavigationButton';
import { Link, useLocation } from 'react-router-dom';
import { LINKS } from 'routes';
import { css, GlobalStyles } from '@mui/styled-engine';

const Navigation: FC = () => {
    const location = useLocation();

    return (
        <s.Container>
            <GlobalStyles
                styles={css`
                    body {
                        padding-bottom: 86px;
                    }
                `}
            />
            <s.LeftBar>
                <SecondaryNavigationButton route={LINKS.PROFILE} selected={location.pathname === LINKS.PROFILE} type={NavigationButtonType.Profile} />
                <SecondaryNavigationButton route={LINKS.FINDINGS} selected={location.pathname === LINKS.FINDINGS} type={NavigationButtonType.SyringeList} />
                <SecondaryNavigationButton route={LINKS.USER} selected={location.pathname === LINKS.USER} type={NavigationButtonType.Users} />
            </s.LeftBar>
            <Link to={LINKS.NEW_FIND_INIT}>
                <s.PrimaryBar>
                    <PrimaryNavigationButton />
                </s.PrimaryBar>
            </Link>
        </s.Container>
    );
};

export default Navigation;
