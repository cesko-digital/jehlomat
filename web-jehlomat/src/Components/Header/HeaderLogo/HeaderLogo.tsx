import React, { FC } from 'react';
import * as s from './HeaderLogoStyles';
import logo from './../../../assets/logo/logo-jehlomat.svg';
import { HeaderLinkType } from '../HeaderLink/HeaderLink';

export interface IHeaderLogo {
    mobile?: boolean;
}

export const HeaderLogo: FC<IHeaderLogo> = ({ mobile }) => {
    return (
        <s.Container mobile={mobile}>
            <s.Logo mobile={mobile} src={logo} />
        </s.Container>
    );
};
