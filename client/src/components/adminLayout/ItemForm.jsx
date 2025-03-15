import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Alert, Container } from 'react-bootstrap';
import { createItem, updateItemById, uploadFile } from '../../utils/api'; // Assuming you have this function for file upload

const ItemForm = ({
    itemData,
    itemErrors,
    handleChange,
    isEditMode,
    showSuccessAlert,
    showUpdateAlert,
    showErrorAlert,
    setShowSuccessAlert,
    setShowUpdateAlert,
    setShowErrorAlert,
    categories,
    subcategories,
    resetItemData,
    fetchItems
}) => {
    const [file, setFile] = useState(null); // Local state to store the file
    const [fileError, setFileError] = useState(''); // Local state for file validation error

    // Handle file input change and validate file type
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileType = selectedFile.type;
            if (fileType.startsWith('image/')) {
                setFile(selectedFile); // Store the selected file if it's an image
                setFileError(''); // Clear file error if it's a valid image
            } else {
                setFileError('Please select a valid image file (JPG, PNG, JPEG).');
                setFile(null); // Clear the file state if the file is not an image
            }
        }
    };

    // Handle file upload and return the file path
    const handleFileUpload = async () => {
        if (!file) return ''; // If no file selected, return an empty string

        try {
            const response = await uploadFile(file);  // Assuming uploadFile is a function that uploads the file
            return response.filePath || '';  // Assuming server returns the filePath
        } catch (error) {
            console.error('Error uploading file:', error);
            setShowErrorAlert(true); // Show error alert if file upload fails
            return ''; // Return empty string if upload fails
        }
    };

    // Validate the item form
    const validateItem = () => {
        const errors = {};
        if (!itemData.category) errors.category = 'Category is required';
        if (!itemData.subCategory) errors.subCategory = 'Subcategory is required';
        if (!itemData.itemName) errors.itemName = 'Item name is required';
        if (!itemData.itemPrice) errors.itemPrice = 'Item price is required';
        if (!itemData.supplierName) errors.supplierName = 'Supplier name is required';
        if (!itemData.supplierEmail) {
            errors.supplierEmail = 'Supplier email is required';
        } else if (!/\S+@\S+\.\S+/.test(itemData.supplierEmail)) {
            errors.supplierEmail = 'Invalid email format';
        }
        return errors;
    };

    // Handle form submit including file upload
    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Validate the form data
        const errors = validateItem();
        if (Object.keys(errors).length > 0 || fileError) {
            setShowErrorAlert(true); // Show error alert if there are validation errors or file error
            return;
        }

        // Handle file upload and get the file path
        const imagePath = await handleFileUpload();

        // If the image upload was successful, include the image path in the form data
        const updatedItemData = {
            ...itemData,
            image: itemData.image ? itemData.image : imagePath
        };

        try {
            let response;
            if (isEditMode) {
                // If editing, update the item
                response = await updateItemById(itemData._id, updatedItemData);
                if (response.ok) {
                    setShowUpdateAlert(true);
                    fetchItems(); // Fetch updated list of items
                } else {
                    setShowErrorAlert(true);
                }
            } else {
                // If adding new item
                response = await createItem(updatedItemData);
                if (response.ok) {
                    setShowSuccessAlert(true);
                    fetchItems(); // Fetch updated list of items
                } else {
                    setShowErrorAlert(true);
                }
            }

            // Reset the form after successful submission
            resetForm();

        } catch (error) {
            setShowErrorAlert(true);
        }
    };

    // Reset the form state, including file and alerts
    const resetForm = () => {
        resetItemData(); // Reset form data (can be passed from the parent)
        setFile(null); // Clear the file state
        setFileError(''); // Clear file validation error
        setShowSuccessAlert(false); // Clear success alert
        setShowUpdateAlert(false); // Clear update alert
        setShowErrorAlert(false); // Clear error alert
    };

    return (
        <Container className="container-1">
            <div className="form form-2">
                <h2 className="text-center mb-4">{isEditMode ? 'Edit Item' : 'Add Item'}</h2>
                {showSuccessAlert && (
                    <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                        Item added successfully!
                    </Alert>
                )}
                {showUpdateAlert && (
                    <Alert variant="info" onClose={() => setShowUpdateAlert(false)} dismissible>
                        Item updated successfully!
                    </Alert>
                )}
                {showErrorAlert && (
                    <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                        Something went wrong. Please try again later.
                    </Alert>
                )}
                {fileError && (
                    <Alert variant="danger" onClose={() => setFileError('')} dismissible>
                        {fileError}
                    </Alert>
                )}

                <Form onSubmit={handleFormSubmit}>
                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="category" className="pb-4">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="category"
                                    value={itemData.category}
                                    onChange={handleChange}
                                    isInvalid={!!itemErrors.category}
                                    className="large-input text-center"
                                >
                                    <option value="">Select Category</option>
                                    {categories && categories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.category}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {itemErrors.category}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="subCategory" className="pb-4">
                                <Form.Label>Subcategory</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="subCategory"
                                    value={itemData.subCategory}
                                    onChange={handleChange}
                                    isInvalid={!!itemErrors.subCategory}
                                    className="large-input text-center"
                                >
                                    <option value="">Select Subcategory</option>
                                    {subcategories && subcategories.map(subcategory => (
                                        <option key={subcategory._id} value={subcategory._id}>
                                            {subcategory.subCategory}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {itemErrors.subCategory}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="itemName" className="pb-4">
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="itemName"
                                    value={itemData.itemName}
                                    onChange={handleChange}
                                    isInvalid={!!itemErrors.itemName}
                                    placeholder="Item Name"
                                    className="large-input text-center"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {itemErrors.itemName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="itemPrice" className="pb-4">
                                <Form.Label>Item Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="itemPrice"
                                    value={itemData.itemPrice}
                                    onChange={handleChange}
                                    isInvalid={!!itemErrors.itemPrice}
                                    placeholder="Item Price"
                                    className="large-input text-center"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {itemErrors.itemPrice}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="gst" className="pb-4">
                                <Form.Label>GST</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="gst"
                                    value={itemData.gst}
                                    onChange={handleChange}
                                    className="large-input text-center"
                                    placeholder="GST"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="stock" className="pb-4">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="stock"
                                    value={itemData.stock}
                                    onChange={handleChange}
                                    className="large-input text-center"
                                    placeholder="Stock"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="minimumStock" className="pb-4">
                                <Form.Label>Minimum Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="minimumStock"
                                    value={itemData.minimumStock}
                                    onChange={handleChange}
                                    className="large-input text-center"
                                    placeholder="Minimum Stock"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="itemDiscount" className="pb-4">
                                <Form.Label>Item Discount</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="itemDiscount"
                                    value={itemData.itemDiscount}
                                    onChange={handleChange}
                                    className="large-input text-center"
                                    placeholder="Item Discount"
                                />
                            </Form.Group>
                        </Col>

                    </Row>

                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="image" className="pb-4">
                                <Form.Label>Item Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleFileChange}
                                    className="large-input text-center"
                                    accept="image/*" // Allow only image files
                                />
                                {fileError && <div className="text-danger">{fileError}</div>}
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Group controlId="supplierName" className="pb-4">
                                <Form.Label>Supplier Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="supplier_Name"
                                    value={itemData.supplier_Name}
                                    onChange={handleChange}
                                    className="large-input text-center"
                                    placeholder="Supplier Name"
                                />
                            </Form.Group>
                        </Col>

                    </Row>

                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="supplierEmail" className="pb-4">
                                <Form.Label>Supplier Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="supplierEmail"
                                    value={itemData.supplierEmail}
                                    onChange={handleChange}
                                    className="large-input text-center"
                                    placeholder="Supplier Email"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit" className="mt-2 signup-button">
                        {isEditMode ? 'Update Item' : 'Add Item'}
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default ItemForm;