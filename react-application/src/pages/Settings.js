import React from "react";
import { useState, useEffect } from "react";
import {
    Button,
    Col,
    Container,
    Row,
    Form,
    Alert
} from "react-bootstrap";
import jwt from "jwt-decode";

const Settings = () => {

    // Form State
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [atRisk, setAtRisk] = useState(false);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    // Status State
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);

    // GET /user/profile/:username
    async function getProfile(username) {
        try {
            const response = await fetch(`/user/profile/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${localStorage.getItem("CHT-tokens")}`
                }
            });
            const data = await response.json();
            if (response.status === 200) {
                return [true, data.user];
            } else {
                return [false, data.message];
            }
        } catch (error) {
            return [false, 'Error occurred when fetching profile'];
        }
    }

    // PATCH /user/profile/:username
    async function patchProfile(username, args) {
        try {
            const response = await fetch(`/user/profile/${username}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${localStorage.getItem("CHT-tokens")}`
                },
                body: JSON.stringify(args)
            });
            const data = await response.json();
            if (response.status === 200) {
                return [true, data.user];
            } else {
                return [false, data.message];
            }
        } catch (error) {
            return [false, 'Error occurred when updating profile'];
        }
    }

    // Fill out Placeholder Values
    async function populateProfile(args, callback, error) {
        const currentUser = jwt(localStorage.getItem("CHT-tokens")).user.user;
        const [status, data] = await callback(currentUser, args);
        if (status) {
            setErrorMessage("");
            // Only don't set success on first load
            setSuccess(username !== '');
            setUsername(data.username);
            setPassword("");
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setAge(data.age);
            setAtRisk(data.atRisk);
            setCity(data.city);
            setState(data.state);
        } else {
            setErrorMessage(data);
            setSuccess(false);
            if (error) {
                error(data);
            }
        }
    }

    // Verify Form Submission
    function submitPatch() {
        let errorMsg = [];
        if (username === '') {
            errorMsg.push('Username cannot be blank');
        }
        if (firstName === '') {
            errorMsg.push('First Name cannot be blank');
        }
        if (lastName === '') {
            errorMsg.push('Last Name cannot be blank');
        }
        if (age === '') {
            errorMsg.push('Age cannot be blank');
        }
        if (age <= 0) {
            errorMsg.push('Age cannot be less than or equal to 0');
        }
        if (city === '') {
            errorMsg.push('City cannot be blank');
        }
        if (state === '') {
            errorMsg.push('State cannot be blank');
        }

        if (errorMsg.length === 0) {
            const args = {
                username,
                password,
                first_name: firstName,
                last_name: lastName,
                age,
                atRisk,
                city,
                state
            };
            populateProfile(args, patchProfile, null);
        } else {
            setErrorMessage(
                <>
                    <p>Input Field Errors:</p>
                    <ul>
                        {errorMsg.map(e => (<li>{e}</li>))}
                    </ul>
                </>
            );
        }
    }

    useEffect(() => {
        populateProfile(null, getProfile);
    }, []);

    return (
        <Container fluid>
            <Row>
                <Col>
                    <h1>Update Profile</h1>
                    <Form>
                        <Form.Group controlId="username" type="text">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                placeholder={username}
                                onChange={(e) => setUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="password" type="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="firstName" type="text">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                placeholder={firstName}
                                onChange={(e) => setFirstName(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="lastName" type="text">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                placeholder={lastName}
                                onChange={(e) => setLastName(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="age" type="number">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder={age}
                                onChange={(e) => setAge(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="atRisk" type="checkbox">
                            <Form.Label>At Risk</Form.Label>
                            <Form.Check
                                checked={atRisk}
                                onChange={(e) => setAtRisk(e.target.checked)} />
                        </Form.Group>
                        <Form.Group controlId="city" type="text">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                placeholder={city}
                                onChange={(e) => setCity(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="state" type="text">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                                placeholder={state}
                                onChange={(e) => setState(e.target.value)} />
                        </Form.Group>
                        <Button
                            style={{ background: "#5340b3", border: "#5340b3" }}
                            onClick={submitPatch}>
                            Save
                        </Button>
                        <br />
                        <br />
                        {errorMessage !== "" && <Alert variant='danger'>{errorMessage}</Alert>}
                        {success && <Alert variant='success'>Profile Updated Successfully. If you changed the username, pleas logout and log back in.</Alert>}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Settings;
