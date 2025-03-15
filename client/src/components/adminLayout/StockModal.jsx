import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const StockModal = ({ showModal, setShowModal, items, stockData, itemErrors, setStockData, setItemErrors, editItemId, setEditItemId, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => setShowModal(false);

    useEffect(() => {
        if (editItemId) {
            const item = items.find(item => item._id === editItemId);
            if (item) {
                setStockData({
                    itemId: item._id,
                    quantity: item.quantity,
                    minimumStock: item.minimumStock,
                });
            }
        }
    }, [editItemId, items, setStockData]);

    const handleSave = async () => {
        setIsLoading(true);

        try {
            // Save stock data
            if (Object.keys(itemErrors).length === 0) {
                await onSave(stockData); // Assuming onSave saves the stock data
                alert("Stock data saved successfully!");
                setShowModal(false);
            }
        } catch (error) {
            console.error("Error saving stock:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStockData(prevData => ({ ...prevData, [name]: value }));
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{editItemId ? 'Edit Stock' : 'Add New Stock'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="itemSelect">
                        <Form.Label>Item</Form.Label>
                        <Form.Control as="select" name="itemId" value={stockData.itemId} onChange={handleChange}>
                            <option value="">Select Item</option>
                            {items.map(item => (
                                <option key={item._id} value={item._id}>{item.itemName}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="quantity">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            name="quantity"
                            value={stockData.quantity}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="minimumStock">
                        <Form.Label>Minimum Stock</Form.Label>
                        <Form.Control
                            type="number"
                            name="minimumStock"
                            value={stockData.minimumStock}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
                {itemErrors && Object.keys(itemErrors).length > 0 && (
                    <Alert variant="danger">
                        There are errors with the stock data. Please fix them before saving.
                    </Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Save"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StockModal;
