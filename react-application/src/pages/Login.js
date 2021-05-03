import { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Redirect } from 'react-router-dom';
import { useAuth } from "../context/auth";
import jwt from "jwt-decode";


function Login(props) {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth();

  const referrer = props.location.state && props.location.state.referrer || '/';

  if (isAdmin) {
    return <Redirect to="/admin" />;
  }

  if (isLoggedIn) {
    return <Redirect to={referrer} />;
  }

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      const data = await response.json();
      if (response.status === 200) {
        setAuthTokens(data);
        setIsAdmin(jwt(localStorage.getItem("CHT-tokens"))?.user?.admin);
        setLoggedIn(true);
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    }
  }

  return (
    <div style={{ padding: "80px 0" }}>
      <Card style={{ width: "380px", margin: "0 auto" }}>
        <Card.Body>
          <Card.Title>
            <h3>Login</h3>
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
            <Button block size="lg" type="submit" disabled={!validateForm()} onClick={handleSubmit}>
              Login
            </Button>
          </Form>
          <br />
          {isError && <Alert variant='danger'>The username or password provided were incorrect.</Alert>}
          <LinkContainer to="/signup">
            <Card.Link>Create new account</Card.Link>
          </LinkContainer>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
