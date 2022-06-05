import { FC } from 'react';

import { Redirect, Route, useLocation } from 'react-router';
import { convertSearchParamsToString } from 'utils/url';
import { LOGIN_URL_PATH } from 'routes';
import { useRecoilValue } from 'recoil';
import { isLoginValidState } from 'store/login';

interface IRedirectSearchParams {
    // specifies redirection URL after successfull login
    from?: string;
}

const PrivateRoute: FC<any> = ({ from, ...rest }) => {
    const location = useLocation();
    const isLoggedIn = useRecoilValue(isLoginValidState);
    const searchParams: IRedirectSearchParams = {};

    if (from) {
        const query = location.search ? location.search : null;
        searchParams.from = location.pathname + query;
    }

    const search = convertSearchParamsToString(searchParams as Record<string, string>);

    return isLoggedIn ? (
        <Route {...rest} />
    ) : (
        <Redirect
            to={{
                pathname: `/${LOGIN_URL_PATH}`,
                state: { from: location },
                search,
            }}
        />
    );
};

export default PrivateRoute;
