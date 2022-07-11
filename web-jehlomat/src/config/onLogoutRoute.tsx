import { FC, useEffect, useState } from 'react';

import { Redirect, Route, useLocation } from 'react-router';
import { convertSearchParamsToString } from 'utils/url';
import { HOME_PATH } from 'routes';
import { useRecoilValue } from 'recoil';
import { isLoginValidState } from 'store/login';

interface IRedirectSearchParams {
    from?: string;
}

const OnLogoutRoute: FC<any> = ({ from, redirectPath, ...rest }) => {
    const location = useLocation();
    const isLoggedIn = useRecoilValue(isLoginValidState);

    const [preIsLoggedIn, setPreIsLoggedIn] = useState(isLoggedIn);
    const searchParams: IRedirectSearchParams = {};
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (preIsLoggedIn !== isLoggedIn && !isLoggedIn) {
            setRedirect(true);
        }
        setPreIsLoggedIn(isLoggedIn);
    }, [isLoggedIn]);

    if (from) {
        const query = location.search ? location.search : null;
        searchParams.from = location.pathname + query;
    }

    const search = convertSearchParamsToString(searchParams as Record<string, string>);

    return redirect ? (
        <Redirect
            to={{
                pathname: redirectPath || HOME_PATH,
                state: { from: location },
                search,
            }}
        />
    ) : (
        <Route {...rest} />
    );
};

export default OnLogoutRoute;
