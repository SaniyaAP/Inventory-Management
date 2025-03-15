import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './NavBar.css'; // Import the CSS file

const NavBar = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        window.location.href = 'file:///G:/Projects%20LS/HTML/inventory-management-HTML/index.html';
    };

    const handleSelect = (eventKey) => {
        switch (eventKey) {
            case 'edit-profile':
                navigate('/edit-profile');
                break;
            case 'change-password':
                navigate('/changePassword');
                break;
            case 'logout':
                // Clear cookies
                Cookies.remove('userData');
                // Clear session storage
                sessionStorage.clear();
                // Clear local storage if needed
                localStorage.clear();
                // Navigate to login and replace history
                navigate('/', { replace: true });
                // Use window.location.replace to ensure no back navigation
                window.location.replace('/');
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" variant="light" style={{ backgroundColor: '#333', padding: '15px 0' }}>
                <Container>
                    <Navbar.Brand href="#" style={{ color: 'white', fontWeight: '600' }} onClick={handleHomeClick}>
                        Inventory Management
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            {/* Use NavLink to highlight the active link */}
                            <Nav.Link
                                as={NavLink}
                                to="/"
                                className="nav-link-hover"
                                style={({ isActive }) => ({ color: isActive ? '#e0696c' : 'white' })}
                            >
                                Home
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to="/register"
                                className="nav-link-hover"
                                style={({ isActive }) => ({ color: isActive ? '#e0696c' : 'white' })}
                            >
                                Register
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to="/login"
                                className="nav-link-hover"
                                style={({ isActive }) => ({ color: isActive ? '#e0696c' : 'white' })}
                            >
                                Login
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavBar;
