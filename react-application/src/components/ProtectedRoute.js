import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";
import jwt from "jwt-decode";

function ProtectedRoute({ component: Component, admin = false, ...rest }) {
    const { authTokens } = useAuth();
    try {
        if (admin) {
            const isAdmin = jwt(localStorage.getItem("CHT-tokens"))?.user?.admin;
            return (
                <Route {...rest} render={props => authTokens && isAdmin
                    ? <Component {...props} />
                    : <Redirect to={{
                        pathname: '/login',
                        state: { referrer: rest.path }
                    }} />} />
            );
        } else {
            return (
                <Route {...rest} render={props => authTokens
                    ? <Component {...props} />
                    : <Redirect to={{
                        pathname: '/login',
                        state: { referrer: rest.path }
                    }} />} />
            );
        }
    } catch (error) {
        return (
            <Redirect to={{
                pathname: '/login',
                state: { referrer: rest.path }
            }} />
        );
    }
}

export default ProtectedRoute;
