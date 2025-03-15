import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { adminForgotPassword } from '../../utils/api';

const AdminForgotPassword = () => {
    const [loginErrors, setLoginErrors] = useState({});
    const [loginData, setLoginData] = useState({ email: '' });
    const navigate = useNavigate(); // Use useHistory to programmatically navigate

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const validateLogin = () => {
        const errors = {};
        if (!loginData.email) errors.email = 'Email is required';
        return errors;
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const errors = validateLogin();
        if (Object.keys(errors).length > 0) {
            setLoginErrors(errors);
            return;
        }
        setLoginErrors({});
        try {
            const response = await adminForgotPassword(loginData.email);

            if (response.ok) {
                alert("Password sent to mail")
                navigate('/guestLayout/adminLogin'); // Redirect to admin layout

            } else {
                const errorData = await response.json();
                setLoginErrors({ server: errorData.message });
            }
        } catch (err) {
            setLoginErrors({ server: `An error occurred. Please try again. ${err}` });
        }
    };

    const handleCreateAccount = () => {
        navigate('/guestLayout/studentRegistration');
    };


    return (
        <div >
            <Container className='container-2'>

                <div className="form form-1">
                    <h2 className='pb-4'>Forgot Password</h2>
                    {loginErrors.server && <Alert variant="danger">{loginErrors.server}</Alert>}
                    <Form onSubmit={handleLoginSubmit}>
                        <Form.Group controlId="formEmail">
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Email address"
                                className={`mb-3 ${loginErrors.email ? 'is-invalid' : ''}`}
                                value={loginData.email}
                                onChange={handleLoginChange}
                            />
                            {loginErrors.email && <p className="invalid-feedback">{loginErrors.email}</p>}
                        </Form.Group>

                        <Button variant="primary" type="submit" className="signup-button-2 mb-3">
                            Submit
                        </Button>
                    </Form>
                </div>

            </Container>
        </div>
    );
}

export default AdminForgotPassword
