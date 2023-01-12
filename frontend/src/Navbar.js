import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

const NavbarTop = ({ connectMetaMask, joinMember, isConnected, isMember }) => {
  return (
    <Navbar bg="info" expand="sm" variant="dark">
      <Container>
        <Navbar.Brand href="/">WeVote</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="create-vote">Create Vote</Nav.Link>
            <Nav.Link href="vote">Vote</Nav.Link>
            {isMember ? null : (
              <Button variant="outline-success" onClick={joinMember}>
                Join WeVote
              </Button>
            )}
          </Nav>
          <Nav>
            {isConnected ? (
              <Navbar.Text>connected</Navbar.Text>
            ) : (
              <Button variant="outline-success" onClick={connectMetaMask}>
                Connect
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarTop;
