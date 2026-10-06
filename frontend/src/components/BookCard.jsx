import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    const isAvailable = book.availableStock > 0;

    return (
        <div className="card h-100 shadow-sm border-0 transition-hover">
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-secondary">{book.category}</span>
                    <span className={`badge ${isAvailable ? 'bg-success' : 'bg-danger'}`}>
                        {isAvailable ? `Stock: ${book.availableStock}` : 'Out of Stock'}
                    </span>
                </div>
                
                <h5 className="card-title fw-bold text-dark">{book.title}</h5>
                <p className="card-text text-muted mb-1 small">
                    <strong>Author: </strong>{book.author}
                </p>
                <p className="card-text text-muted mb-1 small">
                    <strong>ISBN: </strong>{book.isbn}
                </p>
                <p className="card-text text-muted mb-3 small">
                    <strong>Shelf Location: </strong>{book.shelfLocation}
                </p>

                <div className="mt-auto pt-2">
                    <Link to={`/books/${book._id}`} className="btn btn-outline-primary btn-sm w-100">
                        View Details & Borrow
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookCard;