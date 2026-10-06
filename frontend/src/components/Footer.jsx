import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-light text-center text-muted py-3 border-top mt-auto">
            <div className="container">
                <small>© {new Date().getFullYear()} LibHub Central Management System. All Rights Reserved.</small>
            </div>
        </footer>
    );
};

export default Footer;