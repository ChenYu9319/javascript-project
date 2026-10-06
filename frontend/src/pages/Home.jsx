import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="p-5 mb-4 bg-light rounded-3 shadow-sm text-center">
            <div className="container-fluid py-5">
                <h1 className="display-4 fw-bold text-primary mb-3">Welcome to LibHub Central</h1>
                <p className="col-md-8 fs-4 mx-auto text-secondary mb-4">
                    A seamless platform for book searching, online borrowing reservations, and automated inventory management.
                </p>
                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <Link to="/search" className="btn btn-primary btn-lg px-4 me-sm-3 fw-bold">Search Catalog</Link>
                    <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;