import React, { FC, Suspense, useRef } from 'react';
import { Box } from '@mui/material';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { routes } from 'routes';
import { ThemeProvider } from '@mui/material/styles';
import csLocale from 'dayjs/locale/cs';
import DateAdapter from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Footer } from 'Components/Footer/Footer';
import { theme } from 'theme';
import { LoginAlert } from 'Components/Login/LoginAlert';
import { SetLogin } from 'Components/Login/SetLogin';
import ConfirmationModal from 'Components/ConfirmationModal';
import { ConfirmationModalProvider } from 'providers/ConfirmationModalProvider';

import PrivateRoute from 'config/protectedRoute';
const Router: FC = () => (
    <HashRouter>
        <Switch>
            {routes.map(({ Component, exact, AdditionalComponents, path, protectedRoute, from }) => {
                const stringPath = typeof path === 'string' ? path : path(0);
                if (protectedRoute) {
                    return (
                        <PrivateRoute from={from} path={typeof path === 'string' ? path : path(0)} key={stringPath}>
                            <Component exact={exact} />
                            {AdditionalComponents && <AdditionalComponents />}
                        </PrivateRoute>
                    );
                } else {
                    return (
                        <Route path={typeof path === 'string' ? path : path(0)} key={stringPath}>
                            <Component exact={exact} />
                            {AdditionalComponents && <AdditionalComponents />}
                        </Route>
                    );
                }
            })}
        </Switch>
        <Footer />
    </HashRouter>
);

const Providers: FC = ({ children }) => {
    const modalRef = useRef<ConfirmationModal | null>(null);
    return (
        <RecoilRoot>
            <ConfirmationModalProvider modalRef={modalRef}>
                <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={DateAdapter} locale={csLocale}>
                        <RecoilRoot>
                            {children}
                            <ConfirmationModal ref={modalRef} />
                        </RecoilRoot>
                    </LocalizationProvider>
                </ThemeProvider>
            </ConfirmationModalProvider>
        </RecoilRoot>
    );
};

const App: FC = ({ children }) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Providers>
                    <LoginAlert />
                    <Router />
                    <SetLogin />
                </Providers>
            </Box>
        </Suspense>
    );
};

export default App;
