import React, { FC } from 'react';
import * as s from './FooterLogoStyles';
import logo from './../../../assets/logo/logo-magdalena.svg';

export const FooterLogo: FC = () => {
    return (
        <s.Container>
            <s.Logo src={logo} />
        </s.Container>
    );
};
