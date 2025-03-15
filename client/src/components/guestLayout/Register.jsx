import React, { useState } from 'react';
import { Form, Button, Col, Container, Row, Alert } from 'react-bootstrap';
import { signUp } from '../../utils/api';

const Register = () => {

    const [signupData, setSignupData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        address: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: ''
    })

    const [signupErrors, setSignupErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupData({ ...signupData, [name]: value });
    };


    const validateSignup = () => {
        const errors = {};
        if (!signupData.firstName) errors.firstName = 'First name is required';
        if (!signupData.email) errors.email = 'Email is required';
        if (!signupData.password) {
            errors.password = 'Password is required';
        } else {
            // Regular expression for password validation
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

            // Validate password length, uppercase letter, and special character
            if (!passwordRegex.test(signupData.password)) {
                errors.password = 'Password must be at least 8 characters long, include at least one uppercase letter, and one special character.';
            }
        }

        if (!signupData.confirmPassword) errors.confirmPassword = 'Enter Confirm Password';

        if (signupData.password !== signupData.confirmPassword) {
            errors.confirmPassword = 'Entered password and confirm password do not match';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateSignup();

        if (Object.keys(errors).length > 0) {
            setSignupErrors(errors);
            return;
        }

        setSignupErrors({});
        try {

            const response = await signUp(signupData);
            if (response.ok) {
                setShowSuccessAlert(true);
                setSignupData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    gender: '',
                    address: '',
                    dateOfBirth: '',
                    password: '',
                    confirmPassword: ''
                });
            } else {
                setShowErrorAlert(true);
                const errorData = await response.json();
                setSignupErrors({ server: errorData.message });
            }
        } catch (err) {
            setShowErrorAlert(true);
            setSignupErrors({ server: `An error occurred. Please try again. ${err.message}` });
        }
    };

    return (
        <Container className="container-2">
            <div className="form form-2">
                <h2 className="text-center mb-4">Sign Up</h2>
                {showSuccessAlert && (
                    <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                        Sign-up successful!
                    </Alert>
                )}
                {signupErrors.server && (
                    <div className="alert alert-danger">
                        {signupErrors.server}
                    </div>
                )}
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="firstName" className="pb-4">
                                <Form.Label>First Name</Form.Label> {/* Label for First Name */}
                                <Form.Control
                                    className="large-input"
                                    type="text"
                                    name="firstName"
                                    value={signupData.firstName}
                                    onChange={handleChange}
                                    minLength="3"
                                    isInvalid={!!signupErrors.firstName}
                                    placeholder="First Name"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.firstName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="lastName" className="pb-4">
                                <Form.Label>Last Name</Form.Label> {/* Label for Last Name */}
                                <Form.Control
                                    className="large-input"
                                    type="text"
                                    name="lastName"
                                    value={signupData.lastName}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.lastName}
                                    placeholder="Last Name"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.lastName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="email" className="pb-4">
                        <Form.Label>Email</Form.Label> {/* Label for Email */}
                        <Form.Control
                            className="large-input"
                            type="email"
                            name="email"
                            value={signupData.email}
                            onChange={handleChange}
                            isInvalid={!!signupErrors.email}
                            placeholder="Email"
                        />
                        <Form.Control.Feedback type="invalid">
                            {signupErrors.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="address" className="pb-4">
                        <Form.Label>Address</Form.Label> {/* Label for Address */}
                        <Form.Control
                            className="large-input"
                            type="text"
                            name="address"
                            value={signupData.address}
                            onChange={handleChange}
                            isInvalid={!!signupErrors.address}
                            placeholder="Address"
                        />
                        <Form.Control.Feedback type="invalid">
                            {signupErrors.address}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="dateOfBirth" className="pb-4">
                                <Form.Label>Birth Date</Form.Label> {/* Label for Birth Date */}
                                <Form.Control
                                    type="date"
                                    name="dateOfBirth"
                                    value={signupData.dateOfBirth}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.dateOfBirth}
                                    className="large-input"
                                    placeholder="Date of Birth"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.dateOfBirth}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="gender" className="pb-4">
                                <Form.Label>Gender</Form.Label> {/* Label for Gender */}
                                <Form.Control
                                    className="large-input"
                                    as="select"
                                    name="gender"
                                    value={signupData.gender}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.gender}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.gender}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="password" className="pb-4">
                                <Form.Label>Password</Form.Label> {/* Label for Password */}
                                <Form.Control
                                    className="large-input"
                                    type="password"
                                    name="password"
                                    value={signupData.password}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.password}
                                    placeholder="Password"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="confirmPassword" className="pb-4">
                                <Form.Label>Confirm Password</Form.Label> {/* Label for Confirm Password */}
                                <Form.Control
                                    className="large-input"
                                    type="password"
                                    name="confirmPassword"
                                    value={signupData.confirmPassword}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.confirmPassword}
                                    placeholder="Confirm Password"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.confirmPassword}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" type="submit" className="mt-2 signup-button">
                        Sign Up
                    </Button>
                </Form>
            </div>
        </Container>
    )
};

export default Register;
