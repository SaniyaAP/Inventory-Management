import React, { useState, useEffect, useRef } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { MdEdit, MdDelete } from 'react-icons/md';
import { createCategory, deleteCategoryById, getAllCategories, updateCategoryById } from '../../utils/api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [categoryData, setCategoryData] = useState({
        category: '',
        description: ''
    });
    const [categoryErrors, setCategoryErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showUpdateAlert, setShowUpdateAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const formRef = useRef(null);

    useEffect(() => {
        fetchCategories();
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
                    console.error('Expected an array but got:', data);
                    setCategories([]); // Set categories to empty array if response is not an array
                }
            } else {
                console.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({ ...categoryData, [name]: value });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const validateCategory = () => {
        const errors = {};
        if (!categoryData.category) errors.category = 'Category is required';
        if (!categoryData.description) errors.description = 'Sub Category is required';
        return errors;
    };

    const handleSubmit = async (e) => {
        console.log("Entered")
        e.preventDefault();
        const errors = validateCategory();

        if (Object.keys(errors).length > 0) {
            setCategoryErrors(errors);
            return;
        }

        setCategoryErrors({});
        try {
            let response;
            if (isEditMode) {
                response = await updateCategoryById(categoryId, categoryData);
            } else {
                response = await createCategory(categoryData);
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

                setCategoryData({
                    category: '',
                    description: ''
                });
                setCategoryId(null);
                fetchCategories(); // Fetch categories again to update the list after adding/updating a category
                setIsEditMode(false);
            } else {
                console.error('Error:', responseData);
                setShowErrorAlert(true);
                setCategoryErrors({ server: responseData.message });
            }
        } catch (err) {
            console.error('Error in try block:', err);
            setShowErrorAlert(true);
            setCategoryErrors({ server: `An error occurred. Please try again. ${err.message}` });
        }
    };

    const handleEdit = (category) => {
        setCategoryData({
            category: category.category,
            subCategory: category.description
        });
        setIsEditMode(true);
        setCategoryId(category._id);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
    };

    const handleDelete = async (category) => {
        try {
            const response = await deleteCategoryById(category._id);
            if (response.ok) {
                alert("Category Deleted Successfully");
                fetchCategories();
            } else {
                console.error('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    // Filtered categories based on search query
    const filteredCategories = categories.filter((category) =>
        category.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>

            <Container className="container-1" ref={formRef}>
                <div className="form form-2">
                    <h2 className="text-center mb-4">{isEditMode ? 'Edit Category' : 'Add Category'}</h2>
                    {showSuccessAlert && (
                        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                            Category added successfully!
                        </Alert>
                    )}
                    {showUpdateAlert && (
                        <Alert variant="success" onClose={() => setShowUpdateAlert(false)} dismissible>
                            Category updated successfully!
                        </Alert>
                    )}
                    {showErrorAlert && (
                        <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                            Failed to {isEditMode ? 'update' : 'add'} category. {categoryErrors.server}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={12} sm={6}>
                                <Form.Group controlId="category" className="pb-4">
                                    <Form.Label>Category</Form.Label> {/* Label for Category */}
                                    <Form.Control
                                        className="large-input text-center"
                                        type="text"
                                        name="category"
                                        value={categoryData.category}
                                        onChange={handleChange}
                                        minLength="3"
                                        isInvalid={!!categoryErrors.category}
                                        placeholder="Category"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {categoryErrors.category}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Form.Group controlId="description" className="pb-4">
                                    <Form.Label>Description</Form.Label> {/* Label for Description */}
                                    <Form.Control
                                        className="large-input text-center"
                                        type="text"
                                        name="description"
                                        value={categoryData.description}
                                        onChange={handleChange}
                                        isInvalid={!!categoryErrors.description}
                                        placeholder="Description"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {categoryErrors.description}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit" className="mt-2 signup-button">
                            {isEditMode ? 'Update' : 'Add'}
                        </Button>
                    </Form>
                </div>
            </Container>

            <Container className="container-1">
                <div className="list-container scrollable-list">
                    <Row>
                        <Col xs={12} sm={8}>
                            <h2 className="mb-4">List of Categories</h2>
                        </Col>
                        <Col xs={12} sm={4}>
                            <Form.Group controlId="search" >
                                <Form.Control
                                    type="text"
                                    placeholder="Search by Category"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="table-header pb-2 pt-2 GuestHeader">
                        <Col xs={12} sm={1} className="text-center">
                            Sl. No.
                        </Col>
                        <Col xs={12} sm={4} className="text-center">
                            Category Name
                        </Col>
                        <Col xs={12} sm={5} className="text-center">
                            Description
                        </Col>
                        <Col xs={12} sm={2} className="text-center">
                            Actions
                        </Col>
                    </Row>

                    {filteredCategories.map((category, index) => (
                        <Row key={index} className="table-row" onMouseEnter={(e) => e.currentTarget.classList.add('hovered')} onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}>
                            <Col xs={12} sm={1} className="text-center">
                                {index + 1}
                            </Col>
                            <Col xs={12} sm={4} className="text-center">
                                {category.category}
                            </Col>
                            <Col xs={12} sm={5} className="text-center">
                                {category.description}
                            </Col>
                            <Col xs={6} sm={1} className="text-center">
                                <Button variant="primary" type="button" className="mt-2 signup-button" onClick={() => handleEdit(category)}>
                                    <MdEdit />
                                </Button>
                            </Col>
                            <Col xs={6} sm={1} className="text-center">
                                <Button variant="primary" type="button" className="mt-2 signup-button" onClick={() => handleDelete(category)}>
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

export default Categories;
