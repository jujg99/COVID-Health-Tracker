import React, { useState } from "react";
import CHTNavbar from "./components/CHTNavbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Testing from "./pages/Testing";
import Vaccine from "./pages/Vaccine";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/auth";

const CHT_TOKENS = "CHT-tokens";

function App() {
  const existingTokens = JSON.parse(localStorage.getItem(CHT_TOKENS));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem(CHT_TOKENS, JSON.stringify(data));
    setAuthTokens(data);
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        <Router>
          <CHTNavbar />
          <Switch>
            <Route
              exact
              path="/login"
              render={(props) => <Login {...props} />}
            />
            <Route exact path="/signup">
              <Signup />
            </Route>
            <Route exact path="/admin">
              <Admin />
            </Route>
            <Route exact path="/testing">
              <Testing />
            </Route>
            <Route exact path="/vaccine">
              <Vaccine />
            </Route>
            <ProtectedRoute exact path="/profile" component={Profile} />
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
