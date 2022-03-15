import React from 'react';
import { tokenExpirationState } from 'store/login';
import { useRecoilValue } from 'recoil';

interface Props {}

export const LoginAlert: React.FC<Props> = () => {
    // eslint-disable-next-line
    const tokenExpiration = useRecoilValue(tokenExpirationState);

    // todo show alert 10 minutes before expiration
    return <></>;
};

export default LoginAlert;
