import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import AdminHeader from './AdminHeader';
import { Outlet, NavLink } from 'react-router-dom';
import GuestFooter from '../guestLayout/GuestFooter';
import './LeftNavBar.css'; // Import the CSS file for styling

const LeftNavBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Gradient background style for Outlet
    const outletStyle = {
        background: 'linear-gradient(315deg, rgba(199, 222, 236, 1) 10%, rgba(198, 204, 218, 1) 40%, rgba(230, 245, 255, 1) 70%, rgba(255, 250, 250, 1) 90%)',
        animation: 'gradient 15s ease infinite',
        backgroundSize: '400% 400%',
        backgroundAttachment: 'fixed',
        width: '100%',  // Ensuring it takes full width
        height: '100%',  // Ensuring it takes full height
    };

    return (
        <div className="left-nav-bar-container">
            <button className="toggle-btn" onClick={toggleSidebar}>
                {isCollapsed ? <FaBars /> : <FaTimes />}
            </button>

            <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <NavLink to="/admin/categories" className="sidebar-link"></NavLink>
                <NavLink to="/admin/categories" className="sidebar-link">Categories</NavLink>
                <NavLink to="/admin/subCategories" className="sidebar-link">Sub Categories</NavLink>
                <NavLink to="/admin/items" className="sidebar-link">Items</NavLink>
                <NavLink to='/admin/stock' className="sidebar-link">Stock</NavLink>
            </div>

            <div className={`content ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="GuestLayout">
                    <div className="GuestHeader-1">
                        <AdminHeader />
                    </div>
                    <div className="Outlet" style={outletStyle}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeftNavBar;
