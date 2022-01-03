import React, { FC } from 'react';
import * as s from './HeaderMobileStyles';
import { HeaderLogo } from './HeaderLogo/HeaderLogo';
import SecondaryButton from '../Buttons/SecondaryButton/SecondaryButton';
import { HeaderLink, HeaderLinkType } from './HeaderLink/HeaderLink';
import { LineVertical, LinkContainer } from './HeaderMobileStyles';
import TextButton from '../Buttons/TextButton/TextButton';



export const HeaderMobile: FC = ({}) => {
    return <s.Container>
        <s.LogoContainer>
            <HeaderLogo mobile={true}/>
        </s.LogoContainer>
        <s.Title>Monitorovací a analytický nástroj ochrany veřejného zdraví</s.Title>
        <s.ButtonContainer>
            <SecondaryButton text={"Přihlášení"} />
        </s.ButtonContainer>
        <s.LinkContainer>
            <HeaderLink type={HeaderLinkType.CreateOrgAccount} route={"create"} mobile={true} />
                <s.LineVertical/>
            <HeaderLink type={HeaderLinkType.Watch} route={"create"} mobile={true} />
        </s.LinkContainer>
        <s.LineHorizontal/>

        <s.InfoContainer>
            Naši jste jehlu a nevíte, co s ní?
        </s.InfoContainer>

        <s.AnonymousContainer>
            <TextButton text={"Anonymní přístup"} />
        </s.AnonymousContainer>

    </s.Container>
}