import React from 'react';
import { SContainer, SLinkContainer, SMobileContainer } from './HeaderStyles';
import { HeaderLink, HeaderLinkType } from './HeaderLink/HeaderLink';
import { HeaderLogo } from './HeaderLogo/HeaderLogo';
import TitleBar from '../Navigation/TitleBar';

interface Props {
    mobileTitle: string;
    backRoute?: string;
}

export const Header = (props: Props) => {
    return (
        <>
            <SContainer>
                <HeaderLogo />
                <SLinkContainer>
                    <HeaderLink type={HeaderLinkType.AboutApp} route={'about'} />
                    <HeaderLink type={HeaderLinkType.CreateOrgAccount} route={'create'} />
                    <HeaderLink type={HeaderLinkType.Login} route={'login'} />
                </SLinkContainer>
            </SContainer>

            <SMobileContainer>
                <TitleBar>{props.mobileTitle}</TitleBar>
            </SMobileContainer>
        </>
    );
};
