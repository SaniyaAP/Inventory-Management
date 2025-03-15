import { useState } from 'react';
import Cookies from 'js-cookie';

const defaultUser = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    dateOfBirth: '',
    gender: ''
};

export const useUserData = () => {
    const [user, setUser] = useState(() => {
        const userData = Cookies.get('userData');
        if (userData) {
            return JSON.parse(userData);
        }
        return defaultUser;
    });

    const updateUserData = (newUserData) => {
        setUser(newUserData);
        Cookies.set('userData', JSON.stringify(newUserData));
    };

    return { user, updateUserData };
};

const defaultTechExpert = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    gender: '',
    password: '',
    dateOfBirth: '',
    qualification: '',
    experiance: ''
}

export const useTechExpertData = () => {
    const [techExpert, setTechExpert] = useState(() => {
        const userData = Cookies.get('techExpertData');
        if (userData) {
            return JSON.parse(userData);
        }
        return defaultTechExpert;
    });

    const updateUserData = (newUserData) => {
        setTechExpert(newUserData);
        Cookies.set('userData', JSON.stringify(newUserData));
    };

    return { techExpert, updateUserData };
};

const defaultAdminData = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    gender: '',
    password: '',
}

export const useAdminData = () => {
    const [admin, setAdmin] = useState(() => {
        const userData = Cookies.get('admin');
        if (userData) {
            return JSON.parse(userData);
        }
        return defaultAdminData;
    });

    const updateUserData = (newUserData) => {
        setAdmin(newUserData);
        Cookies.set('admin', JSON.stringify(newUserData));
    };

    return { admin, updateUserData };
};