import React, { FC } from 'react';
import * as s from './HeaderStyles';
import { HeaderLink, HeaderLinkType } from './HeaderLink/HeaderLink';
import { HeaderLogo } from './HeaderLogo/HeaderLogo';

export const Header: FC = ({}) => {
 return <s.Container>
     <HeaderLogo/>
         <s.LinkContainer>
             <HeaderLink type={HeaderLinkType.AboutApp} route={"about"} />
             <HeaderLink type={HeaderLinkType.CreateOrgAccount} route={"create"} />
             <HeaderLink type={HeaderLinkType.Login} route={"login"} />
         </s.LinkContainer>
 </s.Container>
}

