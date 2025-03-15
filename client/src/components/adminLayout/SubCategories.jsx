import React, { useState, useEffect, useRef } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { MdEdit, MdDelete } from 'react-icons/md';
import { createSubcategory, deleteSubcategoryById, getAllCategories, getAllSubcategories, updateSubcategoryById } from '../../utils/api';

export const SubCategories = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [subCategoryData, setSubCategoryData] = useState({
        category: '',
        subCategory: '',
        description: ''
    });
    const [subCategoryErrors, setSubCategoryErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showUpdateAlert, setShowUpdateAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editSubcategoryId, setEditSubcategoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const formRef = useRef(null);

    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    const sortedCategories = data.sort((a, b) => a.category.localeCompare(b.category));
                    setCategories(sortedCategories);
                } else {
                    setCategories([]);
                }
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubcategories = async () => {
        try {
            const response = await getAllSubcategories();
            if (response.ok) {
                const data = await response.json();
                setSubcategories(data);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubCategoryData({ ...subCategoryData, [name]: value });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const validateSubCategory = () => {
        const errors = {};
        if (!subCategoryData.category) errors.category = 'Category is required';
        if (!subCategoryData.subCategory) errors.subCategory = 'Subcategory name is required';
        if (!subCategoryData.description) errors.description = 'Description is required';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateSubCategory();

        if (Object.keys(errors).length > 0) {
            setSubCategoryErrors(errors);
            return;
        }

        setSubCategoryErrors({});
        try {
            let response;
            if (isEditMode) {
                response = await updateSubcategoryById(editSubcategoryId, subCategoryData);
            } else {
                response = await createSubcategory(subCategoryData);
            }

            const responseData = await response.json();

            if (response.ok) {
                if (isEditMode) {
                    setShowUpdateAlert(true);
                    setShowSuccessAlert(false);
                } else {
                    setShowUpdateAlert(false);
                    setShowSuccessAlert(true);
                }

                setSubCategoryData({ category: '', subCategory: '', description: '' });
                setEditSubcategoryId(null);
                fetchSubcategories(); // Fetch subcategories again to update the list after adding/updating
                setIsEditMode(false);
            } else {
                console.error('Error:', responseData);
                setShowErrorAlert(true);
                setSubCategoryErrors({ server: responseData.message });
            }
        } catch (err) {
            console.error('Error in try block:', err);
            setShowErrorAlert(true);
            setSubCategoryErrors({ server: `An error occurred. Please try again. ${err.message}` });
        }
    };

    const handleEdit = (subcategory) => {
        setSubCategoryData({
            category: subcategory.category,
            subCategory: subcategory.subCategory,
            description: subcategory.description
        });
        setIsEditMode(true);
        setEditSubcategoryId(subcategory._id);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
    };

    const handleDelete = async (subcategory) => {
        if (window.confirm('Are you sure you want to delete this subcategory?')) {
            try {
                const response = await deleteSubcategoryById(subcategory._id);
                if (response.ok) {
                    alert("Subcategory Deleted Successfully");
                    fetchSubcategories();
                } else {
                    console.error('Failed to delete subcategory');
                }
            } catch (error) {
                console.error('Error deleting subcategory:', error);
            }
        }
    };

    // Filtered subcategories based on search query
    const filteredSubcategories = subcategories.filter((subcategory) =>
        subcategory.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <Container className="container-1" ref={formRef}>
                <div className="form form-2">
                    <h2 className="text-center mb-4">{isEditMode ? 'Edit SubCategory' : 'Add SubCategory'}</h2>
                    {showSuccessAlert && (
                        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                            Subcategory added successfully!
                        </Alert>
                    )}
                    {showUpdateAlert && (
                        <Alert variant="success" onClose={() => setShowUpdateAlert(false)} dismissible>
                            Subcategory updated successfully!
                        </Alert>
                    )}
                    {showErrorAlert && (
                        <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                            Failed to {isEditMode ? 'update' : 'add'} subcategory. {subCategoryErrors.server}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={12} sm={6}>
                                <Form.Group controlId="category" className="pb-4">
                                    <Form.Label>Select Category</Form.Label> {/* Label for Select Category */}
                                    <Form.Select
                                        name="category"
                                        value={subCategoryData.category}
                                        onChange={handleChange}
                                        isInvalid={!!subCategoryErrors.category}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.category}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {subCategoryErrors.category}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Form.Group controlId="subCategory" className="pb-4">
                                    <Form.Label>Subcategory Name</Form.Label> {/* Label for Subcategory Name */}
                                    <Form.Control
                                        type="text"
                                        name="subCategory"
                                        value={subCategoryData.subCategory}
                                        onChange={handleChange}
                                        isInvalid={!!subCategoryErrors.subCategory}
                                        placeholder="Subcategory Name"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {subCategoryErrors.subCategory}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="description" className="pb-4">
                            <Form.Label>Description</Form.Label> {/* Label for Description */}
                            <Form.Control
                                type="text"
                                name="description"
                                value={subCategoryData.description}
                                onChange={handleChange}
                                isInvalid={!!subCategoryErrors.description}
                                placeholder="Description"
                            />
                            <Form.Control.Feedback type="invalid">
                                {subCategoryErrors.description}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-2 signup-button">
                            {isEditMode ? 'Update SubCategory' : 'Add SubCategory'}
                        </Button>
                    </Form>
                </div>
            </Container>


            <Container className="container-1">
                <div className="list-container scrollable-list">
                    <Row>
                        <Col xs={12} sm={8}>
                            <h2 className="mb-4">List of SubCategories</h2>
                        </Col>
                        <Col xs={12} sm={4}>
                            <Form.Group controlId="search">
                                <Form.Control
                                    type="text"
                                    placeholder="Search by Subcategory Name"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="table-header pb-2 pt-2">
                        <Col xs={12} sm={1} className="text-center">Sl. No.</Col>
                        <Col xs={12} sm={4} className="text-center">Subcategory Name</Col>
                        <Col xs={12} sm={5} className="text-center">Description</Col>
                        <Col xs={12} sm={2} className="text-center">Actions</Col>
                    </Row>

                    {filteredSubcategories.map((subcategory, index) => (
                        <Row key={subcategory._id} className="table-row" onMouseEnter={(e) => e.currentTarget.classList.add('hovered')} onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}>
                            <Col xs={12} sm={1} className="text-center">{index + 1}</Col>
                            <Col xs={12} sm={4} className="text-center">{subcategory.subCategory}</Col>
                            <Col xs={12} sm={5} className="text-center">{subcategory.description}</Col>
                            <Col xs={6} sm={1} className="text-center">
                                <Button variant="primary" type="button" className="mt-2 signup-button" onClick={() => handleEdit(subcategory)}>
                                    <MdEdit />
                                </Button>
                            </Col>
                            <Col xs={6} sm={1} className="text-center">
                                <Button variant="primary" type="button" className="mt-2 signup-button" onClick={() => handleDelete(subcategory)}>
                                    <MdDelete />
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default SubCategories;