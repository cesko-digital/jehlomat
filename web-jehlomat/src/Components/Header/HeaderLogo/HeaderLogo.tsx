import React, { FC } from 'react';
import * as s from './HeaderLogoStyles';
import logoMobile from './../../../assets/logo/logo-jehlomat.cz-white.svg';

export interface IHeaderLogo {
    mobile?: boolean;
}

export const HeaderLogo: FC<IHeaderLogo> = ({ mobile }) => {
    return (
        <s.Container mobile={mobile}>
            <s.Logo mobile={mobile} src={logoMobile} />
        </s.Container>
    );
};
