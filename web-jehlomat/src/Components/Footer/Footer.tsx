import React, { FC } from 'react';
import { SContainer, SLinkContainer } from './FooterStyles';
import { FooterLogo } from './FooterLogo/FooterLogo';
import { FooterLink, FooterLinkType } from './FooterLink/FooterLink';

export const Footer: FC = () => {
    return (
        <SContainer>
            <FooterLogo />
            <SLinkContainer>
                <FooterLink type={FooterLinkType.AboutApp} route={'about'} />
                <FooterLink type={FooterLinkType.AboutJehlomat} route={'/'} />
                <FooterLink type={FooterLinkType.Contact} route={'/'} />
            </SLinkContainer>
        </SContainer>
    );
};
