import React from 'react';
import './GuestFooter.css'; // Import custom CSS file for styling

const GuestFooter = () => {
  return (
    <div className="guest-footer">
      <div className="footer-content">
        <h2 className="footer-heading">Inventory Management System using AI/ML</h2>
        <p className="footer-description">
          A cutting-edge inventory management solution powered by Artificial Intelligence and Machine Learning.
          This project helps businesses optimize inventory control, predict demand, and automate supply chain processes.
        </p>
        <div className="credits">
          <h3>&copy; All Rights are reserved to abc Company</h3>
          <p className="credits-description">An innovative solution developed aiming to bring AI/ML into real-world applications.</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com/your-repository" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </div>
  );
};

export default GuestFooter;
