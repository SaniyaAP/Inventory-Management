import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../utils/Cookies';
import { changeUserPassword } from '../../utils/api';

const ChangePassword = () => {
    const { user, updateUserData } = useUserData();
    const [changePasswordErrors, setChangePasswordErrors] = useState({});
    const [changePasswordData, setChangePasswordData] = useState({
        oldPassword: '',
        newPassword: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChangePasswordData({ ...changePasswordData, [name]: value });
    };

    const validateLogin = () => {
        const errors = {};
        if (!changePasswordData.oldPassword) errors.oldPassword = 'Old password is required';
        if (!changePasswordData.newPassword) errors.newPassword = 'New password is required';
        return errors;
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        const errors = validateLogin();
        if (Object.keys(errors).length > 0) {
            setChangePasswordErrors(errors);
            return;
        }
        setChangePasswordErrors({});
        try {
            const response = await changeUserPassword(user._id, changePasswordData);
            if (response.ok) {
                alert('Password changed successfully');
                navigate('/codeStack');
            } else if (response.status === 401) {
                setChangePasswordErrors({ server: 'Wrong credentials. Please try again.' });
            } else {
                const errorData = await response.json();
                setChangePasswordErrors({ server: errorData.message });
            }
        } catch (err) {
            setChangePasswordErrors({ server: `An error occurred. Please try again. ${err}` });
        }
    };

    return (
        <div>
            <Container className='container-2'>
                <div className="form form-1">
                    <h2 className='pb-4'>Change Password</h2>
                    <Form onSubmit={handleChangePasswordSubmit}>
                        <Form.Group controlId="formOldPassword">
                            <Form.Label>Old Password</Form.Label> {/* Label for Old Password */}
                            <Form.Control
                                type="password"
                                name="oldPassword"
                                placeholder="Old Password"
                                className={`mb-3 ${changePasswordErrors.oldPassword ? 'is-invalid' : ''}`}
                                value={changePasswordData.oldPassword}
                                onChange={handleChange}
                            />
                            {changePasswordErrors.oldPassword && <p className="invalid-feedback">{changePasswordErrors.oldPassword}</p>}
                        </Form.Group>

                        <Form.Group controlId="formNewPassword">
                            <Form.Label>New Password</Form.Label> {/* Label for New Password */}
                            <Form.Control
                                type="password"
                                name="newPassword"
                                placeholder="New Password"
                                className={`mb-3 ${changePasswordErrors.newPassword ? 'is-invalid' : ''}`}
                                value={changePasswordData.newPassword}
                                onChange={handleChange}
                            />
                            {changePasswordErrors.newPassword && <p className="invalid-feedback">{changePasswordErrors.newPassword}</p>}
                        </Form.Group>

                        {changePasswordErrors.server && (
                            <div className="alert alert-danger">
                                {changePasswordErrors.server}
                            </div>
                        )}

                        <Button variant="primary" type="submit" className="signup-button-2 mb-3">
                            Change Password
                        </Button>
                    </Form>
                </div>
            </Container>

        </div>
    );
};

export default ChangePassword;
