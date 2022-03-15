import { FC } from 'react';
import { Redirect, Route, useLocation } from 'react-router';
import { useRecoilValue } from 'recoil';
import { isLoginValidState } from 'store/login';

const PrivateRoute: FC<any> = props => {
    const location = useLocation();
    const isLoggedIn = useRecoilValue(isLoginValidState);

    return isLoggedIn ? (
        <Route {...props} />
    ) : (
        <Redirect
            to={{
                pathname: '/login',
                state: { from: location },
            }}
        />
    );
};

export default PrivateRoute;
