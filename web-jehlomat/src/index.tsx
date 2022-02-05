import reportWebVitals from './reportWebVitals';
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import { LINKS } from './utils/links';
import { Footer } from './Components/Footer/Footer';
import AboutPage from './screens/AboutPage';
import Layout from './Components/Layout/Layout';

const Prihlaseni = lazy(() => import('./screens/Prihlaseni/Prihlaseni'));
const Welcome = lazy(() => import('./screens/Prihlaseni/Welcome')); // Temp welcome
const Organizace = lazy(() => import('./screens/Organizace/Organizace'));
const Profil = lazy(() => import('./screens/Profil/Profil'));
const NovyNalez = lazy(() => import('./screens/NovyNalez/NovyNalez'));
const Nalezy = lazy(() => import('./screens/Nalezy/Nalezy'));
const Dekujeme = lazy(() => import('./screens/RegistraceOrganizace/Dekujeme'));
const RegistraceOrganizace = lazy(() => import('./screens/RegistraceOrganizace/RegistraceOrganizace'));
const RegistraceUzivatele = lazy(() => import('./screens/RegistraceUzivatele/RegistraceUzivatele'));
const OvereniEmailu = lazy(() => import('./screens/RegistraceUzivatele/OvereniEmailu'));

const DekujemeUzivatel = lazy(() => import('./screens/RegistraceUzivatele/Dekujeme'));
const SeznamUzivatelu = lazy(() => import('./screens/SeznamUzivatelu/SeznamUzivatelu'));
const PridatUzivatele = lazy(() => import('./screens/RegistraceUzivatele/PridatUzivatele'));
const ErrorPage = lazy(() => import('./screens/ErrorPage/ErrorPage'));
const TrackovaniNalezu = lazy(() => import('./screens/TrackovaniNalezu/TrackovaniNalezu'));
const LandingPage = lazy(() => import('./screens/LandingPage'));
const NavodLikvidace = lazy(() => import('./screens/NavodLikvidace/NavodLikvidace'));

ReactDOM.render(
    <React.StrictMode>
        <Suspense fallback={<div>Loading...</div>}>
            <HashRouter>
                <App>
                    <Switch>
                        <Route path={LINKS.login}>
                            <Prihlaseni />
                        </Route>
                        <Route path="/welcome">
                            <Welcome />
                        </Route>

                        <Route
                            path={LINKS.user}
                            render={() => (
                                <>
                                    <Route component={SeznamUzivatelu} exact />
                                    <Route path={LINKS.userNew} component={PridatUzivatele} />
                                    <Route path={LINKS.userValidation} component={OvereniEmailu} />
                                    <Route path={LINKS.userRegistration} component={RegistraceUzivatele} />
                                    <Route path={LINKS.userThankYou} component={DekujemeUzivatel} />
                                </>
                            )}
                        />
                        <Route
                            path={LINKS.organization}
                            render={() => (
                                <>
                                    <Route component={Organizace} />
                                    <Route path={LINKS.organizationRegistration} component={RegistraceOrganizace} />
                                    <Route path={LINKS.organizationThankYou} component={Dekujeme} />
                                </>
                            )}
                        />
                        <Route
                            path={LINKS.findings}
                            render={() => (
                                <>
                                    <Route component={Layout} />
                                    <Switch>
                                        <Route path={LINKS.trackingFind} component={TrackovaniNalezu} />
                                        <Route path={LINKS.newFind(0)} component={NovyNalez} />
                                        <Route path={'/'} component={Nalezy} />
                                    </Switch>
                                </>
                            )}
                        />

                        <Route path={LINKS.profile} component={Profil} />
                        <Route path={LINKS.error} component={ErrorPage} />
                        <Route path={LINKS.disposalInstructions} component={NavodLikvidace} />
                        <Route path={LINKS.about} component={AboutPage} />
                        <Route path={LINKS.home}>
                            <LandingPage />
                        </Route>
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
