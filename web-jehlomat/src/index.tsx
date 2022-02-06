import reportWebVitals from './reportWebVitals';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import { Footer } from './Components/Footer/Footer';

import { routes } from 'routes';

ReactDOM.render(
    <React.StrictMode>
        <Suspense fallback={<div>Loading...</div>}>
            <HashRouter>
                <App>
                    <Switch>
                        {routes.map(({ Component, exact, AdditionalComponents, path }) => (
                            <Route path={typeof path === 'string' ? path : path(0)}>
                                {AdditionalComponents && <AdditionalComponents />}
                                <Component exact={exact} />
                            </Route>
                        ))}
                    </Switch>
                    <Footer />
                </App>
            </HashRouter>
        </Suspense>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
