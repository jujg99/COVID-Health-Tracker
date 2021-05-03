import { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Redirect } from 'react-router-dom';
import { useAuth } from "../context/auth";


function Signup() {
    const [isSignedUp, setSignedUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [age, setAge] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const { setAuthTokens } = useAuth();

    if (isSignedUp) {
        return <Redirect to="/profile" />;
    }

    function validateForm() {
        const errorMsg = [];
        if (username === '') {
            errorMsg.push('Username cannot be blank');
        }
        if (password === '') {
            errorMsg.push('Password cannot be blank');
        }
        if (first_name === '') {
            errorMsg.push('First Name cannot be blank');
        }
        if (last_name === '') {
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
        if (state.length !== 2) {
            errorMsg.push('State must be a two-letter abbreviation');
        }
        if (errorMsg.length === 0) {
            return true;
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

    async function handleSubmit(event) {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const response = await fetch('/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    first_name,
                    last_name,
                    age,
                    city,
                    state
                })
            });
            const data = await response.json();
            if (response.status === 200) {
                setAuthTokens(data);
                setSignedUp(true);
                setErrorMessage("");
            } else {
                setErrorMessage(<span>{data.message}</span>);
            }
        } catch (error) {
            setErrorMessage(<span>Problem with server, please try again.</span>);
        }
    }

    return (
        <div style={{ padding: "80px 0" }}>
            <Card style={{ width: "380px", margin: "0 auto" }}>
                <Card.Body>
                    <Card.Title>
                        <h3>Sign Up</h3>
                    </Card.Title>
                    <Form>
                        <Form.Group size="lg" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                autoFocus
                                type="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="first_name">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={first_name}
                                onChange={(e) => setFirst_name(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="last_name">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={last_name}
                                onChange={(e) => setLast_name(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="age">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="city">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="state">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                        </Form.Group>
                        <Button block size="lg" type="submit" onClick={handleSubmit}>
                            Sign Up
                        </Button>
                    </Form>
                    <br />
                    {errorMessage !== "" && <Alert variant='danger'>{errorMessage}</Alert>}
                    <LinkContainer to="/login">
                        <Card.Link>Already have an account? Log in</Card.Link>
                    </LinkContainer>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Signup;
