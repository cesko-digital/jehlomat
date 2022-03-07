import React, { FC } from 'react';
import * as s from './HeaderLogoStyles';
import logoMobile from './../../../assets/logo/logo-jehlomat.cz-white.svg';

export const HeaderLogo: FC = () => {
    return (
        <s.Container>
            <s.Logo src={logoMobile} />
        </s.Container>
    );
};
