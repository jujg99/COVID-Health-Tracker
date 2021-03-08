import { Navbar, Nav, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../context/auth";

const CHTNavbar = () => {
  const { setAuthTokens } = useAuth();
  const token = getToken();

  function logOut() {
    setAuthTokens(null);
  }

  function getToken() {
    const existingTokens = JSON.parse(localStorage.getItem("CHT-tokens"));
    return existingTokens?.token;
  }

  return (
    <Navbar sticky="top" style={{ background: "#408cb3" }} variant="dark">
      <LinkContainer to="/">
        <Navbar.Brand href="#home">COVID Health Tracker</Navbar.Brand>
      </LinkContainer>
      <Nav className="mr-auto">
        <LinkContainer to="/profile">
          <Nav.Link>Profile</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/#">
          <Nav.Link>Data</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/testing">
          <Nav.Link>Testing</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/vaccine">
          <Nav.Link>Vaccine</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/#">
          <Nav.Link>News</Nav.Link>
        </LinkContainer>
      </Nav>
      <Nav>
        {token ? (
          <>
            <Nav.Link onClick={logOut}>Logout</Nav.Link>
          </>
        ) : (
          <>
            <LinkContainer to="/signup">
              <Nav.Link>Signup</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
          </>
        )}
      </Nav>
    </Navbar>
  );
};

export default CHTNavbar;
