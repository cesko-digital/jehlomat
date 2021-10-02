import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App/App";
import Navigation from "./Components/Navigation";

/**
 * Lazy loading routes
 */
const Organizace = lazy(() => import("./Organizace/Organizace"));
const Profil = lazy(() => import("./Profil/Profil"));
const NovyNalez = lazy(() => import("./NovyNalez/NovyNalez"));
const Nalezy = lazy(() => import("./Nalezy/Nalezy"));
const Registrace = lazy(() => import("./Registrace/Registrace"));
// **********************************************************************

/**
 *
 * TO-DO: Wrap whole application with AppContainer to simulate local state with logged user.
 * For future requests etc.
 */

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Navigation />
        <Switch>
          <Route path="/registrace" component={Registrace}>
            <Registrace />
          </Route>
          <Route path="/profil" component={Profil}>
            <Profil />
          </Route>
          <Route path="/organizace" component={Organizace}>
            <Organizace />
          </Route>
          <Route path="/novy-nalez" component={NovyNalez}>
            <NovyNalez />
          </Route>
          <Route path="/nalezy" component={Nalezy}>
            <Nalezy />
          </Route>
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </Router>
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);
