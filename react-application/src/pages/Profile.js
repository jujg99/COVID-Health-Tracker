import React from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from "../context/auth";

const Profile = () => {
    const { setAuthTokens } = useAuth();

    function logOut() {
        setAuthTokens(null);
    }

    return (
        <>
            <h1>Profile</h1>
            <Button onClick={logOut}>Log out</Button>
        </>
    );
};

export default Profile;
