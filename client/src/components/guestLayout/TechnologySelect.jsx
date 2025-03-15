// src/components/TechnologySelect.js
import React from 'react';
import { Form } from 'react-bootstrap';

const TechnologySelect = ({ technologies, selectedTechnology, onTechnologyChange }) => {
    return (
        <Form.Group controlId="technology" className="pb-4">
            <Form.Control
                className="large-input text-center right-align-options"
                as="select"
                value={selectedTechnology}
                onChange={onTechnologyChange}
            >
                <option value="">Select Technology</option>
                {technologies.map((technology) => (
                    <option key={technology._id} value={technology._id}>
                        {technology.technology}
                    </option>
                ))}
            </Form.Control>
        </Form.Group>
    );
};

export default TechnologySelect;
