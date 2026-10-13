import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    const isAvailable = book.availableStock > 0;

    return (
        <div className="card h-100 shadow-sm card-dark-glass card-hover rounded-4 overflow-hidden">
            <div className="card-body d-flex flex-column p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-white bg-opacity-10 text-white border border-white border-opacity-10 px-2.5 py-1 rounded-pill small">
                        <i className="fa-solid fa-bookmark me-1 text-info"></i>{book.category}
                    </span>
                    <span className={`badge ${isAvailable ? 'bg-success bg-opacity-25 text-success border border-success border-opacity-25' : 'bg-danger bg-opacity-25 text-danger border border-danger border-opacity-25'} px-2.5 py-1 rounded-pill`}>
                        {isAvailable ? `Stock: ${book.availableStock}` : 'Out of Stock'}
                    </span>
                </div>
                
                <h5 className="card-title fw-bold text-white mb-2">{book.title}</h5>
                <p className="card-text text-white-50 mb-1 small">
                    <i className="fa-solid fa-user-pen me-2 text-info opacity-75"></i><strong>Author:</strong> {book.author}
                </p>
                <p className="card-text text-white-50 mb-1 small">
                    <i className="fa-solid fa-barcode me-2 text-info opacity-75"></i><strong>ISBN:</strong> {book.isbn}
                </p>
                <p className="card-text text-white-50 mb-3 small">
                    <i className="fa-solid fa-location-dot me-2 text-info opacity-75"></i><strong>Shelf:</strong> {book.shelfLocation}
                </p>

                <div className="mt-auto pt-3 border-top border-white border-opacity-10">
                    <Link to={`/books/${book._id}`} className="btn btn-primary-gradient btn-sm w-100 rounded-3 py-2 fw-medium shadow-sm">
                        View Details <i className="fa-solid fa-arrow-right ms-1"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookCard;