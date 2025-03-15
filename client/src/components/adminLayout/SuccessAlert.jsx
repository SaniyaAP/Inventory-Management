import React from 'react';
import { Alert } from 'react-bootstrap';

const SuccessAlert = ({ editItemId, onClose }) => (
    <Alert variant="success" onClose={onClose} dismissible>
        Item {editItemId ? 'updated' : 'added'} successfully!
    </Alert>
);

export default SuccessAlert;
