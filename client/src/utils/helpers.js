export const calculateTotal = (items, setTotalAmount) => {
    const total = items.reduce((sum, item) => sum + (item.total || 0), 0);
    setTotalAmount(total);
};

export const validateItemData = (itemData) => {
    const errors = {};
    if (!itemData.itemId) errors.itemId = 'Item is required';
    if (itemData.quantity <= 0) errors.quantity = 'Quantity must be greater than 0';
    return errors;
};