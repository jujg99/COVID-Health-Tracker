import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <div style={{ padding: "80px 0" }}>
      <Card style={{ width: "380px", margin: "0 auto" }}>
        <Card.Body>
          <Card.Title>
            <h3>Login</h3>
          </Card.Title>
          <Form onSubmit={handleSubmit}>
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
            <Button block size="lg" type="submit" disabled={!validateForm()}>
              Login
            </Button>
          </Form>
          <br />
          <LinkContainer to="/signup">
            <Card.Link>Create new account</Card.Link>
          </LinkContainer>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
