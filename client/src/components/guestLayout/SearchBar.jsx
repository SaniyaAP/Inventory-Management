// src/components/SearchBar.js
import React from 'react';
import { Form } from 'react-bootstrap';

const SearchBar = ({ searchQuery, onSearchChange }) => {
    return (
        <Form.Group controlId="search">
            <Form.Control
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={onSearchChange}
            />
        </Form.Group>
    );
};

export default SearchBar;
