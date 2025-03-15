import Stock from "../models/Stock.js";  // Import the Stock model
import Items from "../models/Items.js";  // Import the Items model to reference item data

// Create a new stock record
export const createStock = async (req, res) => {
    try {
        const { item, stockQuantity } = req.body;

        // Check if the item exists in the Items collection
        const itemExists = await Items.findById(item);
        if (!itemExists) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Create a new stock record
        const newStock = new Stock({
            item: item,
            stockQuantity: stockQuantity,
        });

        // Save the new stock record
        await newStock.save();

        return res.status(201).json({ message: 'Stock created successfully', stock: newStock });
    } catch (err) {
        console.error('Error creating stock:', err);
        return res.status(500).json({ message: 'An error occurred while processing your request' });
    }
};

// Get all stock records
export const getAllStock = async (req, res) => {
    try {
        const stockRecords = await Stock.find().populate('item');  // Populate the related item data
        return res.status(200).json(stockRecords);
    } catch (err) {
        console.error('Error fetching stock records:', err);
        return res.status(500).json({ message: 'An error occurred while fetching stock records' });
    }
};

// Get stock by item ID
export const getStockByItemId = async (req, res) => {
    const { itemId } = req.params;

    try {
        const stock = await Stock.findOne({ item: itemId }).populate('item');
        if (!stock) {
            return res.status(404).json({ message: 'Stock record not found for this item' });
        }

        return res.status(200).json(stock);
    } catch (err) {
        console.error('Error fetching stock by item ID:', err);
        return res.status(500).json({ message: 'An error occurred while fetching stock for the item' });
    }
};

// Update stock quantity by stock ID
export const updateStockById = async (req, res) => {
    const { id } = req.params;
    const { stockQuantity } = req.body;

    try {
        const updatedStock = await Stock.findByIdAndUpdate(id, { stockQuantity }, { new: true });

        if (!updatedStock) {
            return res.status(404).json({ message: 'Stock record not found' });
        }

        // Check if stock is low by comparing with the related item's minimum stock level
        const item = await Items.findById(updatedStock.item);
        updatedStock.lowStock = updatedStock.stockQuantity < item.minimumStock;
        await updatedStock.save();

        return res.status(200).json({ message: 'Stock updated successfully', stock: updatedStock });
    } catch (err) {
        console.error('Error updating stock:', err);
        return res.status(500).json({ message: 'An error occurred while updating stock' });
    }
};

// Delete a stock record by stock ID
export const deleteStockById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedStock = await Stock.findByIdAndDelete(id);

        if (!deletedStock) {
            return res.status(404).json({ message: 'Stock record not found' });
        }

        return res.status(200).json({ message: 'Stock deleted successfully', stock: deletedStock });
    } catch (err) {
        console.error('Error deleting stock:', err);
        return res.status(500).json({ message: 'An error occurred while deleting stock' });
    }
};
