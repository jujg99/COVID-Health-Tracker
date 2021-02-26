import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";

function ProtectedRoute({ component: Component, ...rest }) {
    const { authTokens } = useAuth();
    return (
        <Route {...rest} render={props => authTokens
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
                state: { referrer: rest.path }
            }} />} />
    );
}

export default ProtectedRoute;
