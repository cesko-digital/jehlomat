import React, {FC} from 'react';
import * as s from "./HeaderLogoStyles";
import logo from "./../../../assets/logo/logo-jehlomat.svg";

export const HeaderLogo: FC = ({}) => {
    return <s.Container><s.Logo src={logo}/></s.Container>
}