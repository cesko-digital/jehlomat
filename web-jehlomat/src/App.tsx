import React, { FC, Suspense, useRef } from 'react';
import { Box } from '@mui/material';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { routes } from 'routes';
import { Footer } from 'Components/Footer/Footer';

import PrivateRoute from 'config/protectedRoute';
import { LoginAlert } from 'Components/Login/LoginAlert';
import { SetLogin } from 'Components/Login/SetLogin';
import ConfirmationModal from 'Components/ConfirmationModal';
import { ConfirmationModalProvider } from 'providers/ConfirmationModalProvider';

const Router: FC = () => (
    <HashRouter>
        <Switch>
            {routes.map(({ Component, exact, AdditionalComponents, path, protectedRoute, from }) => {
                const stringPath = typeof path === 'string' ? path : path(0);
                if (protectedRoute) {
                    return (
                        <PrivateRoute from={from} path={typeof path === 'string' ? path : path(0)} key={stringPath}>
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

const App: FC = ({ children }) => {
    const modalRef = useRef<ConfirmationModal | null>(null);
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <RecoilRoot>
                    <ConfirmationModalProvider modalRef={modalRef}>
                        <LoginAlert />
                        <Router />
                        <SetLogin />
                        <ConfirmationModal ref={modalRef} />
                    </ConfirmationModalProvider>
                </RecoilRoot>
            </Box>
        </Suspense>
    );
};

export default App;
