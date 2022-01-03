import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, HashRouter, Route, Switch } from 'react-router-dom';
import App from './App/App';
import Navigation from './Components/Navigation/Navigation';
import { HeaderMobile } from './Components/Header/HeaderMobile';
import Potvrzeni from './NovyNalez/Components/Potvrzeni';

/**
 * Lazy loading routes
 */
const Organizace = lazy(() => import('./Organizace/Organizace'));
const Profil = lazy(() => import('./Profil/Profil'));
const NovyNalez = lazy(() => import('./NovyNalez/NovyNalez'));
const Nalezy = lazy(() => import('./Nalezy/Nalezy'));
const Dekujeme = lazy(() => import('./RegistraceOrganizace/Dekujeme'));
const RegistraceOrganizace = lazy(() => import('./RegistraceOrganizace/RegistraceOrganizace'));
const RegistraceUzivatele = lazy(() => import('./RegistraceUzivatele/RegistraceUzivatele'));
const OvereniEmailu = lazy(() => import('./RegistraceUzivatele/OvereniEmailu'));

const DekujemeUzivatel = lazy(() => import('./RegistraceUzivatele/Dekujeme'));
const SeznamUzivatelu = lazy(() => import('./SeznamUzivatelu/SeznamUzivatelu'));
const PridatUzivatele = lazy(() => import('./RegistraceUzivatele/PridatUzivatele'));
const ErrorPage = lazy(() => import('./ErrorPage/ErrorPage'));
const TrackovaniNalezu = lazy(() => import('./TrackovaniNalezu/TrackovaniNalezu'));
const LandingPage = lazy(() => import('./LandingPage'));
const NavodLikvidace = lazy(() => import('./NavodLikvidace/NavodLikvidace'));

// **********************************************************************

/**
 *
 * TO-DO: Wrap whole application with AppContainer to simulate local state with logged user.
 * For future requests etc.
 */

ReactDOM.render(
    <React.StrictMode>
        <Suspense fallback={<div>Loading...</div>}>
            <HashRouter>
                {/*TODO: Navigation shouldn't be here, but on specific controllers*/}
                {/*<Navigation />*/}
                <Switch>
                    <Route path="/mobile">
                        <HeaderMobile />
                    </Route>
                    <Route
                        path="/uzivatel"
                        render={({ match: { url } }) => (
                            <>
                                <Route path={`${url}`} component={SeznamUzivatelu} exact />
                                <Route path={`${url}/novy`} component={PridatUzivatele} />
                                <Route path={`${url}/validace`} component={OvereniEmailu} />
                                <Route path={`${url}/registrace`} component={RegistraceUzivatele} />
                                <Route path={`${url}/dekujeme`} component={DekujemeUzivatel} />
                            </>
                        )}
                    />
                    <Route
                        path="/organizace"
                        render={({ match: { url } }) => (
                            <>
                                <Route path={`${url}/registrace`} component={RegistraceOrganizace} exact />
                                <Route path={`${url}/dekujeme`} component={Dekujeme} />
                            </>
                        )}
                    />
                    <Route path="/organizace" component={Organizace} />
                    <Route path="/profil" component={Profil} />
                    <Route path="/novy-nalez" component={NovyNalez} />
                    <Route path="/nalezy" component={Nalezy} />
                    <Route path="/error" component={ErrorPage} />
                    <Route path="/landing-page" component={LandingPage} />
                    <Route path="/trackovaninalezu" component={TrackovaniNalezu} />
                    <Route path="/navod-likvidace" component={NavodLikvidace} />
                    <Route path="/">
                        <App />
                    </Route>
                </Switch>
            </HashRouter>
        </Suspense>
    </React.StrictMode>,
    document.getElementById('root'),
);
