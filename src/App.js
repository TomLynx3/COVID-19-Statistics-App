import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Table from "./components/Table/Table";

import Navbar from "./components/Navbar/Navbar";
import Graphic from "./components/Graphic/Graphic";
import "./App.css";

function App() {
  return (
    <Fragment>
      <Router>
        <div className="container">
          <Navbar />
          <div className="content">
            <Switch>
              <Route exact path="/" component={Table} />
              <Route exact path="/graphic" component={Graphic} />
            </Switch>
          </div>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
