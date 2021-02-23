import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CHTNavbar = () => {
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
        <LinkContainer to="/#">
          <Nav.Link>Testing</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/#">
          <Nav.Link>Vaccine</Nav.Link>
        </LinkContainer>
      </Nav>
      <Nav>
        <LinkContainer to="/signup">
          <Nav.Link>Signup</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/login">
          <Nav.Link>Login</Nav.Link>
        </LinkContainer>
      </Nav>
    </Navbar>
  );
};

export default CHTNavbar;
