import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import App from "./App/App";
import Register from "./Register/Register";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/about">
          <div>
            <h1>About</h1>
          </div>
        </Route>
        <Route path="/">
          <App />
        </Route>
        <Route path="/register" component={Register}>
          <Register />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
