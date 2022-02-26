import React, { FC, Suspense } from 'react';
import { Box } from '@mui/material';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { routes } from 'routes';
import { Footer } from 'Components/Footer/Footer';
import { LoginContext, useLogin } from 'utils/login';

const Router: FC = () => (
    <HashRouter>
        <Switch>
            {routes.map(({ Component, exact, AdditionalComponents, path }) => {
                const stringPath = typeof path === 'string' ? path : path(0);
                return (
                    <Route path={typeof path === 'string' ? path : path(0)} key={stringPath}>
                        {AdditionalComponents && <AdditionalComponents />}
                        <Component exact={exact} />
                    </Route>
                );
            })}
        </Switch>
        <Footer />
    </HashRouter>
);

const Providers: FC = ({ children }) => {
    let { token, setLogin} = useLogin();
    if(!token){
        if(localStorage.getItem("auth")){
            token = localStorage.getItem("auth");
        }
    }
    return <LoginContext.Provider value={{ token, setToken: setLogin }}>{children}</LoginContext.Provider>;
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
