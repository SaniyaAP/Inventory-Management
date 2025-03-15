import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { updateUser } from '../../utils/api';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../utils/Cookies';

const EditProfile = () => {
    const { user: initialUser, updateUserData } = useUserData();
    const [user, setUser] = useState(initialUser);
    const [errors, setErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (initialUser) {
            setUser(initialUser);
        }
    }, [initialUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const validateForm = () => {
        const errors = {};
        if (!user.firstName) errors.firstName = 'First name is required';
        if (!user.email) errors.email = 'Email is required';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setErrors({});
        try {
            const response = await updateUser(user._id, user);
            if (response.ok) {
                alert('Profile updated successfully');
                Cookies.set('userData', JSON.stringify(user));

                updateUserData(user); // Update user data in the context
                navigate('/codeStack'); // Redirect to admin layout

            } else {
                const errorData = await response.json();
                setErrors({ server: errorData.message });
            }
        } catch (err) {
            setErrors({ server: `An error occurred. Please try again. ${err.message}` });
        }
    };

    return (

        <Container className="container-2">
            <div className="form form-2">
                <h2 className="text-center mb-4">Edit Profile</h2>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="firstName" className="pb-4">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    className="large-input"
                                    type="text"
                                    name="firstName"
                                    value={user.firstName}
                                    onChange={handleChange}
                                    minLength="3"
                                    isInvalid={!!errors.firstName}
                                    placeholder="First Name"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.firstName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="lastName" className="pb-4">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    className="large-input"
                                    type="text"
                                    name="lastName"
                                    value={user.lastName}
                                    onChange={handleChange}
                                    isInvalid={!!errors.lastName}
                                    placeholder="Last Name"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.lastName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="email" className="pb-4">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            className="large-input"
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                            placeholder="Email"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="address" className="pb-4">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            className="large-input"
                            type="text"
                            name="address"
                            value={user.address}
                            onChange={handleChange}
                            isInvalid={!!errors.address}
                            placeholder="Address"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.address}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="dateOfBirth" className="pb-4">
                                <Row>
                                    <Form.Label>Birth Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="dateOfBirth"
                                        value={user.dateOfBirth}
                                        onChange={handleChange}
                                        isInvalid={!!errors.dateOfBirth}
                                        className="large-input"
                                        placeholder="Date of Birth"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.dateOfBirth}
                                    </Form.Control.Feedback>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="gender" className="pb-4">
                                <Form.Label>Gender</Form.Label>
                                <Form.Control
                                    className="large-input"
                                    as="select"
                                    name="gender"
                                    value={user.gender}
                                    onChange={handleChange}
                                    isInvalid={!!errors.gender}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {errors.gender}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    {errors.server && (
                        <div className="alert alert-danger">
                            {errors.server}
                        </div>
                    )}
                    <Button variant="primary" type="submit" className="mt-2 signup-button">
                        Update Profile
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default EditProfile;
