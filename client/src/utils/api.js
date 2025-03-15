const API_URL = 'http://localhost:7000';

const apiRequest = async (endpoint, method = 'GET', data = null) => {
    const url = `${API_URL}${endpoint}`;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {

        const response = await fetch(url, options);

        return response;
    } catch (error) {
        throw new Error('An error occurred while processing your request');
    }
};

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error uploading file');
        }

        const result = await response.json(); // Assuming the response contains { filePath }
        return result;
    } catch (error) {
        throw new Error('Error uploading file');
    }
};


export const getAllInteractions = () => {
    return apiRequest(`/interaction/`, 'GET');
}


export const signUp = (signupData) => {
    return apiRequest('/user/createUser', 'POST',
        signupData);
};

export const login = (loginData) => {
    return apiRequest('/user/login', 'POST', loginData);
};

export const getUsers = () => {
    return apiRequest('/user', 'GET');
}

export const getUserById = (id) => {
    return apiRequest(`/user/${id}`, 'GET');
}

export const updateUser = (id, userData) => {
    return apiRequest(`/user/updateById/${id}`, 'PUT', userData);
}

export const changeUserPassword = (id, changeUserPasswordData) => {
    return apiRequest(`/user/changePassword/${id}`, 'PUT', changeUserPasswordData);
}

export const userForgotPassword = (email) => {
    return apiRequest(`/user/forgotPassword/${email}`, 'PUT');
}

export const adminChangePassword = (id, changeUserPasswordData) => {
    return apiRequest(`/admin/changePassword/${id}`, 'PUT', changeUserPasswordData);
}

export const adminLogin = (data) => {
    return apiRequest(`/admin/login/`, 'POST', data);
}

export const adminForgotPassword = (email) => {
    return apiRequest(`/admin/forgotPassword/${email}`, 'PUT');
}

export const createCategory = (categoryData) => {
    return apiRequest('/category/createCategory', 'POST', categoryData);
}

export const getAllCategories = () => {
    return apiRequest('/category', 'GET');
}

export const updateCategoryById = (id, updateCategoryData) => {
    return apiRequest(`/category/updateCategoryById/${id}`, 'PUT', updateCategoryData);
}

export const deleteCategoryById = (id) => {
    return apiRequest(`/category/deleteCategoryById/${id}`, 'DELETE')
}

export const createSubcategory = (subcategoryData) => {
    return apiRequest('/subcategory/createSubcategory', 'POST', subcategoryData);
}

export const deleteSubcategoryById = () => {
    return apiRequest('/subcategory', 'DELETE');
}

export const getAllSubcategories = () => {
    return apiRequest(`/subcategory/`, 'GET');
}


export const getAllSubcategoriesByCategoryId = (category) => {
    return apiRequest(`/subCategory/${category}`, 'GET');
}

export const updateSubcategoryById = (id) => {
    return apiRequest(`/subcategory/deleteSubcategoryById/${id}`, 'DELETE')
}


export const createItem = (data) => {
    return apiRequest('/item/create', 'POST', data);
}

export const deleteItemById = (id) => {
    return apiRequest(`/item/deleteItemById/${id}`, 'DELETE');
};

// Get all items
export const getAllItems = () => {
    return apiRequest('/item/', 'GET');
};


export const fetchItemsBySearchTerm = (term) => {
    return apiRequest(`/item/${term}`, 'GET');
}
// Update an item by ID
export const updateItemById = (id, data) => {
    return apiRequest(`/item/updateItemById/${id}`, 'PUT', data);
};

export const createBillItem = (data) => {
    return apiRequest('/bill/create', 'POST', data);
};

// Delete a bill item by ID
export const deleteBillItemById = (id) => {
    return apiRequest(`/bill/delete/${id}`, 'DELETE');
};

// Update a bill item by ID
export const updateBillItemById = (id, data) => {
    return apiRequest(`/bill/updateBillById/${id}`, 'PUT', data);
};

// Get all bill items (if needed)
export const getAllBillItems = () => {
    return apiRequest('/bill/all', 'GET');
};

export const createNotification = (notificationData) => {
    return apiRequest('/notification/createNotification', 'POST', notificationData);
}

export const getAllNotifications = () => {
    return apiRequest('/notification', 'GET');
}

export const updateNotificationById = (id, updateNotificationData) => {
    return apiRequest(`/notification/updateNotificationById/${id}`, 'PUT', updateNotificationData);
}

export const deleteNotificationById = (id) => {
    return apiRequest(`/notification/deleteNotificationById/${id}`, 'DELETE')
}


// Get all bills
export const getAllBills = () => {
    return apiRequest('/bill/', 'GET');
};

// Fetch bills by a search term (if applicable)
export const fetchBillsBySearchTerm = (term) => {
    return apiRequest(`/bill/search/${term}`, 'GET');
};

// Create a new bill
export const createBill = (data) => {
    return apiRequest('/bill/create', 'POST', data);
};

// Update a bill by ID
export const updateBillById = (id, data) => {
    return apiRequest(`/bill/update/${id}`, 'PUT', data);
};

// Delete a bill by ID
export const deleteBillById = (id) => {
    return apiRequest(`/bill/delete/${id}`, 'DELETE');
};

export const createStock = async (stockData) => {
    return fetch('/api/stock/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stockData),
    });
};

export const getAllStock = async () => {
    return fetch('/api/stock');
};

export const updateStockById = async (stockId, updateData) => {
    return fetch(`/api/stock/update/${stockId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
    });
};
