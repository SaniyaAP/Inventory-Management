import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ItemForm from './ItemForm';
import ItemList from './ItemList';
import {
    createItem,
    deleteItemById,
    getAllCategories,
    getAllItems,
    getAllSubcategoriesByCategoryId,
    updateItemById
} from '../../utils/api';

const Items = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [items, setItems] = useState([]);
    const [itemData, setItemData] = useState({
        category: '',
        subCategory: '',
        itemName: '',
        itemPrice: '',
        gst: '',
        stock: '',
        minimumStock: '',
        itemDiscount: '',
        image: '',
        supplierName: '',
        supplierEmail: ''
    });
    const [itemErrors, setItemErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showUpdateAlert, setShowUpdateAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        fetchCategories();
        fetchItems();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            logError(error);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const response = await getAllSubcategoriesByCategoryId(categoryId);
            if (response.ok) {
                const data = await response.json();
                setSubcategories(data);
            }
        } catch (error) {
            logError(error);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await getAllItems();
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            logError(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            setItemData({ ...itemData, category: value, subCategory: '' });
            fetchSubcategories(value);
        } else {
            setItemData({ ...itemData, [name]: value });
        }
    };

    const validateItem = () => {
        const errors = {};
        if (!itemData.category) errors.category = 'Category is required';
        if (!itemData.subCategory) errors.subCategory = 'Subcategory is required';
        if (!itemData.itemName) errors.itemName = 'Item name is required';
        if (!itemData.itemPrice) errors.itemPrice = 'Item price is required';
        return errors;
    };

    const handleEdit = async (item) => {
        console.log(item)
        setItemData({
            _id: item._id,
            category: item.category,
            subCategory: item.subCategory,
            itemName: item.itemName,
            itemPrice: item.itemPrice,
            gst: item.gst || '',
            stock: item.stock || '',
            minimumStock: item.minimumStock || '',
            itemDiscount: item.itemDiscount || '',
            image: item.image || '',
            supplierName: item.supplierName || '',
            supplierEmail: item.supplierEmail || ''
        });
        setIsEditMode(true);
        setEditItemId(item._id);
        await fetchSubcategories(item.category); // Fetch subcategories based on selected category
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (item) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await deleteItemById(item._id);
                if (response.ok) {
                    setItems((prevItems) => prevItems.filter(i => i._id !== item._id));
                    setShowSuccessAlert(true);
                } else {
                    const errorData = await response.json();
                    setShowErrorAlert(true);
                }
            } catch (error) {
                logError(error);
            }
        }
    };

    const resetItemData = () => {
        setItemData({
            category: '',
            subCategory: '',
            itemName: '',
            itemPrice: '',
            gst: '',
            stock: '',
            minimumStock: '',
            itemDiscount: '',
            image: '',
            supplierName: '',
            supplierEmail: ''
        });
        setIsEditMode(false);
        setEditItemId(null);
        setSubcategories([]);
    };

    const logError = (error) => {
        console.error('An error occurred:', error);
        setShowErrorAlert(true);
    };

    return (
        <div>
            <Container className="container-1" ref={formRef}>
                <ItemForm
                    itemData={itemData}
                    itemErrors={itemErrors}
                    handleChange={handleChange}
                    isEditMode={isEditMode}
                    showSuccessAlert={showSuccessAlert}
                    showUpdateAlert={showUpdateAlert}
                    showErrorAlert={showErrorAlert}
                    setShowSuccessAlert={setShowSuccessAlert}
                    setShowUpdateAlert={setShowUpdateAlert}
                    setShowErrorAlert={setShowErrorAlert}
                    categories={categories}
                    subcategories={subcategories}
                    resetItemData={resetItemData} // Passing resetItemData
                    fetchItems={fetchItems}
                />
            </Container>

            <Container className="container-1">
                <Row>
                    <Col xs={12}>
                        <ItemList
                            items={items}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Items;
