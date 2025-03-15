import React, { useState } from 'react';
import { Button, Col, Form, Row, Modal } from 'react-bootstrap';
import { MdEdit, MdDelete } from 'react-icons/md';

const ItemList = ({ items, handleEdit, handleDelete }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showImage, setShowImage] = useState(false); // State to control image modal visibility
    const [imageUrl, setImageUrl] = useState(''); // State to store the clicked image URL

    // Filter items based on search query
    const filteredItems = items.filter(item =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent form submission if needed
    };

    // Function to handle image click and show modal
    const handleImageClick = (imagePath) => {
        setImageUrl(`http://localhost:7000/${imagePath}`);
        setShowImage(true); // Open modal with the clicked image
    };

    // Function to close image modal
    const handleCloseModal = () => {
        setShowImage(false);
        setImageUrl('');
    };

    return (
        <div className="list-container scrollable-list">
            <Form onSubmit={handleSearchSubmit}>
                <Row>
                    <Col xs={12} sm={8}>
                        <h2 className="mb-4">List of Items</h2>
                    </Col>
                    <Col xs={12} sm={4} className="d-flex">
                        <Form.Group controlId="search" className="flex-grow-1">
                            <Form.Control
                                type="text"
                                placeholder="Search by Item Name"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="ml-2">
                            Search
                        </Button>
                    </Col>
                </Row>

                <Row className="table-header pb-2 pt-2 GuestHeader">
                    <Col xs={1} className="text-center">Sl. No.</Col>
                    <Col xs={3} className="text-center">Item Name</Col>
                    <Col xs={1} className="text-center">Item Price</Col>
                    <Col xs={3} className="text-center">Image</Col>
                    <Col xs={2} className="text-center">Supplier Name</Col>
                    <Col xs={1} className="text-center">Edit</Col>
                    <Col xs={1} className="text-center">Delete</Col>
                </Row>

                {filteredItems.map((item, index) => (
                    <Row key={item._id} className="table-row">
                        <Col xs={1} className="text-center">{index + 1}</Col>
                        <Col xs={3} className="text-center">{item.itemName}</Col>
                        <Col xs={1 } className="text-center">{item.itemPrice}</Col>
                        <Col xs={3} className="text-center">
                            {/* Check if image exists and display it */}
                            {item.image ? (
                                <img
                                    src={`http://localhost:7000/${item.image}`}
                                    alt={item.itemName}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', cursor: 'pointer' }}
                                    onClick={() => handleImageClick(item.image)} // Handle click to open in modal
                                />
                            ) : (
                                <span>No Image</span> // In case no image is available
                            )}
                        </Col>
                        <Col xs={2} className="text-center">{item.supplier_Name || 'N/A'}</Col>
                        <Col xs={1} className="text-center">
                            <Button variant="primary" onClick={() => handleEdit(item)}>
                                <MdEdit />
                            </Button>
                        </Col>
                        <Col xs={1} className="text-center">
                            <Button variant="danger" onClick={() => handleDelete(item)}>
                                <MdDelete />
                            </Button>
                        </Col>
                    </Row>
                ))}
            </Form>

            {/* Modal to display enlarged image */}
            <Modal show={showImage} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Image</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <img
                        src={imageUrl}
                        alt="Enlarged"
                        className="img-fluid"
                        style={{ maxWidth: '90%', maxHeight: '80vh', objectFit: 'contain' }}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ItemList;