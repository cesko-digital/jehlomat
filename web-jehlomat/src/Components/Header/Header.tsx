import React, { FC } from 'react';
import * as s from './HeaderStyles';
import { HeaderLink, HeaderLinkType } from './HeaderLink/HeaderLink';
import { HeaderLogo } from './HeaderLogo/HeaderLogo';

export const Header: FC = ({}) => {
 return <s.Container>
     <HeaderLogo/>
         <s.LinkContainer>
             <HeaderLink type={HeaderLinkType.AboutApp} route={"/"} />
             <HeaderLink type={HeaderLinkType.CreateOrgAccount} route={"organizace/registrace"} />
             <HeaderLink type={HeaderLinkType.Login} route={"prihlaseni"} />
         </s.LinkContainer>
 </s.Container>
}

