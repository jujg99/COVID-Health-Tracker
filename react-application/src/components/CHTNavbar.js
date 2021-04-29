import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../context/auth";
import jwt from "jwt-decode";

const CHTNavbar = () => {
  const { setAuthTokens } = useAuth();
  const token = getToken();
  const admin = (token) ? jwt(localStorage.getItem("CHT-tokens")).user.admin : 0;

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
        {(admin === 1) &&
          <LinkContainer to="/admin">
            <Nav.Link>Admin</Nav.Link>
          </LinkContainer>
        }
        <LinkContainer to="/profile">
          <Nav.Link>Profile</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/data">
          <Nav.Link>Data</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/testing">
          <Nav.Link>Testing</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/vaccine">
          <Nav.Link>Vaccine</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/news">
          <Nav.Link>News</Nav.Link>
        </LinkContainer>
      </Nav>
      <Nav>
        {token ? (
          <>
            <LinkContainer to="/help">
              <Nav.Link>Help</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/settings">
              <Nav.Link>Settings</Nav.Link>
            </LinkContainer>
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
