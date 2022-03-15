import React, { FC, Suspense, useEffect } from 'react';
import { Box } from '@mui/material';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';
import { routes } from 'routes';
import { Footer } from 'Components/Footer/Footer';

import PrivateRoute from 'config/protectedRoute';
import { LoginAlert } from 'Components/Login/LoginAlert';
import { LoginSet } from 'Components/Login/LoginSet';

const Router: FC = () => (
    <HashRouter>
        <Switch>
            {routes.map(({ Component, exact, AdditionalComponents, path, protectedRoute }) => {
                const stringPath = typeof path === 'string' ? path : path(0);
                if (protectedRoute) {
                    return (
                        <PrivateRoute path={typeof path === 'string' ? path : path(0)} key={stringPath}>
                            {AdditionalComponents && <AdditionalComponents />}
                            <Component exact={exact} />
                        </PrivateRoute>
                    );
                } else {
                    return (
                        <Route path={typeof path === 'string' ? path : path(0)} key={stringPath}>
                            {AdditionalComponents && <AdditionalComponents />}
                            <Component exact={exact} />
                        </Route>
                    );
                }
            })}
        </Switch>
        <Footer />
    </HashRouter>
);

const Providers: FC = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;

const App: FC = ({ children }) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Providers>
                    <LoginAlert />
                    <Router />
                    <LoginSet />
                </Providers>
            </Box>
        </Suspense>
    );
};

export default App;
