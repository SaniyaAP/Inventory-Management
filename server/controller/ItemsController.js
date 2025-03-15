import Items from "../models/Items.js";

// Create a new item
export const createItem = async (req, res) => {
    try {
        const { category, subCategory, itemName, itemPrice } = req.body;

        const newItem = new Items(req.body);

        await newItem.save();

        return res.status(201).json({ message: 'Items created successfully', item: newItem });

    } catch (err) {
        console.error('Error creating item:', err);
        return res.status(500).json({ message: 'An error occurred while processing your request' });
    }
};

// Get all items
export const getAllItems = async (req, res) => {
    try {
        const items = await Items.find();
        console.log(items)
        return res.status(200).json(items);
    } catch (err) {
        console.error('Error fetching items:', err);
        return res.status(500).json({ message: 'An error occurred while processing your request' });
    }
};

export const fetchItemsBySearchTerm = async (req, res) => {
    const { term } = req.params; // Get the search term from URL params

    try {
        // Use MongoDB's regex and case-insensitive options to search by item name
        const items = await Items.find({
            itemName: { $regex: term, $options: 'i' } // 'i' for case-insensitive
        }).limit(10); // Limit the number of results if necessary

        return res.status(200).json(items); // Send back the matching items as JSON
    } catch (error) {
        console.error('Error fetching items by search term:', error);
        return res.status(500).json({ message: 'An error occurred while fetching items' });
    }
};


// Get items by category
export const getItemsByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const items = await Items.find({ category: categoryId }).populate('subCategory');
        return res.status(200).json(items);
    } catch (err) {
        console.error('Error fetching items by category:', err);
        return res.status(500).json({ message: 'An error occurred while processing your request' });
    }
};

// Update an item by ID
export const updateItemById = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedItem = await Items.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: 'Items not found' });
        }

        return res.status(200).json({ message: 'Items updated successfully', item: updatedItem });

    } catch (error) {
        console.error('Error updating item:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};

// Delete an item by ID
export const deleteItemById = async (req, res) => {
    const { id } = req.params;

    try {
        console.log(req.params.id)
        const deletedItem = await Items.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Items not found' });
        }

        return res.status(200).json({ message: 'Items deleted successfully', item: deletedItem });

    } catch (error) {
        console.error('Error deleting item:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};
