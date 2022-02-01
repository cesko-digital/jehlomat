import React, { FC } from 'react';
import * as s from './NavigationStyles';
import { NavigationButtonType, PrimaryNavigationButton, SecondaryNavigationButton } from './NavigationButton';
import { Link, useLocation } from 'react-router-dom';
import { LINKS } from '../../utils/links';
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
                <SecondaryNavigationButton route={LINKS.profile} selected={location.pathname === LINKS.profile} type={NavigationButtonType.Profile} />
                <SecondaryNavigationButton route={LINKS.findings} selected={location.pathname === LINKS.findings} type={NavigationButtonType.SyringeList} />
                <SecondaryNavigationButton route={LINKS.user} selected={location.pathname === LINKS.user} type={NavigationButtonType.Users} />
            </s.LeftBar>
            <Link to={LINKS.newFind(0)}>
                <s.PrimaryBar>
                    <PrimaryNavigationButton />
                </s.PrimaryBar>
            </Link>
        </s.Container>
    );
};

export default Navigation;
