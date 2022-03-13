import React, { FC, Suspense } from 'react';
import { Box } from '@mui/material';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { routes } from 'routes';
import { ThemeProvider } from '@mui/material/styles';
import csLocale from 'dayjs/locale/cs';
import DateAdapter from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Footer } from 'Components/Footer/Footer';
import { LoginContext, useLogin } from 'utils/login';
import PrivateRoute from 'config/protectedRoute';
import { theme } from 'theme';

const Router: FC = () => (
    <HashRouter>
        <Switch>
            {routes.map(({ Component, exact, AdditionalComponents, path, protectedRoute }) => {
                const stringPath = typeof path === 'string' ? path : path(0);
                if (protectedRoute) {
                    return (
                        <PrivateRoute path={typeof path === 'string' ? path : path(0)} key={stringPath}>
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
    let { token, setLogin } = useLogin();
    if (!token) {
        if (localStorage.getItem('auth')) {
            token = localStorage.getItem('auth');
        }
    }
    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={DateAdapter} locale={csLocale}>
                <LoginContext.Provider value={{ token, setToken: setLogin }}>{children}</LoginContext.Provider>{' '}
            </LocalizationProvider>
        </ThemeProvider>
    );
};

const App: FC = ({ children }) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Providers>
                    <Router />
                </Providers>
            </Box>
        </Suspense>
    );
};

export default App;
