import React from 'react';
import { Table, Button } from 'react-bootstrap';

const StockTable = ({
    stockItems,
    totalStock,
    setEditItemId,
    setShowModal,
    setStockData,
    updateStockQuantity,
}) => {

    const handleEdit = (stockItem) => {
        if (!stockItem || !stockItem.item) return;

        setStockData({
            itemId: stockItem.item._id,
            quantity: stockItem.quantity,
            minimumStock: stockItem.minimumStock,
        });

        setEditItemId(stockItem._id);
        setShowModal(true);
    };

    const handleUpdateQuantity = (stockId, currentQuantity) => {
        const newQuantity = currentQuantity + 1;
        updateStockQuantity(stockId, newQuantity);
    };

    return (
        <div>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Minimum Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stockItems.length > 0 ? (
                        stockItems.map((stockItem) => {
                            const { item, quantity, minimumStock, _id } = stockItem;
                            return (
                                <tr key={_id}>
                                    <td>{item ? item.itemName : 'Unnamed Item'}</td>
                                    <td>{quantity}</td>
                                    <td>{minimumStock ?? 'N/A'}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => handleEdit(stockItem)}>Edit</Button>
                                        <Button variant="danger" onClick={() => handleUpdateQuantity(_id, quantity)}>Increase Stock</Button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No stock items available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <div>
                <h4>Total Stock: {totalStock}</h4>
            </div>
        </div>
    );
};

export default StockTable;