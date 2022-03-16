import { FC } from 'react';
import Box from '@mui/material/Box';
import { Redirect, Route, useLocation } from 'react-router';
import { useRecoilValue } from 'recoil';
import { isLoginValidState } from 'store/login';

const PrivateRoute: FC<any> = props => {
    const location = useLocation();
    const isLoggedIn = useRecoilValue(isLoginValidState);

    return isLoggedIn ? (
        <Box py={8}>
        <Route {...props} />
        </Box>
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
