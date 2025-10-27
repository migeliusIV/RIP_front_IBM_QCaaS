import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const AppNavbar = () => {
    return (
        <Navbar bg="light" variant="light" fixed="top" className="shadow-sm border-bottom">
            <Container fluid className="px-4">
                <Navbar.Brand as={Link} to="/IBM" className="d-flex align-items-center fs-4">
                    <span className="me-2">IBM</span>
                    <Nav.Link 
                        as={Link} 
                        to="/gates" 
                        className="fs-5 p-0 text-decoration-none text-dark"
                    >
                        Quantum
                    </Nav.Link>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
};