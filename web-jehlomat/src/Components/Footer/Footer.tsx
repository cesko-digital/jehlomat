import React, { FC } from 'react';
import * as s from './FooterStyles';
import { FooterLogo } from '../Footer/FooterLogo/FooterLogo';
import { FooterLink, FooterLinkType } from '../Footer/FooterLink/FooterLink';

export const Footer: FC = ({}) => {
    return <s.Container>
        <FooterLogo/>
        <s.LinkContainer>
            <FooterLink type={FooterLinkType.AboutApp} route={"about"} />
            <FooterLink type={FooterLinkType.AboutJehlomat} route={"/"} />
            <FooterLink type={FooterLinkType.Contact} route={"/"} />
        </s.LinkContainer>
    </s.Container>
}