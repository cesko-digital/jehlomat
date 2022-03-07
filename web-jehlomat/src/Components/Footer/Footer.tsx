import React, { FC } from 'react';
import { SContainer, SLinkContainer } from './FooterStyles';
import { FooterLogo } from './FooterLogo/FooterLogo';
import { FooterLink, FooterLinkType } from './FooterLink/FooterLink';
import { LINKS } from 'routes';

export const Footer: FC = () => {
    return (
        <SContainer>
            <FooterLogo />
            <SLinkContainer>
                <FooterLink type={FooterLinkType.AboutApp} route={LINKS.ABOUT} />
                <FooterLink type={FooterLinkType.AboutJehlomat} route={'/'} />
                <FooterLink type={FooterLinkType.Contact} route={'/'} />
            </SLinkContainer>
        </SContainer>
    );
};
