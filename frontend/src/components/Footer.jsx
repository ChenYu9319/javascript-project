import React from 'react';

const Footer = () => {
    return (
        <footer 
            className="text-center text-white py-3 mt-auto"
            style={{ 
                backgroundColor: '#060911',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
        >
            <div className="container">
                <small>© {new Date().getFullYear()} LibHub Central Management System. All Rights Reserved.</small>
            </div>
        </footer>
    );
};

export default Footer;