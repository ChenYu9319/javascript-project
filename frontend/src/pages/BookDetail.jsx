import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../auth/Auth';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [book, setBook] = useState(null);

    useEffect(() => {
        API.get(`/books/${id}`)
            .then(res => setBook(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const handleBorrow = async () => {
        if (!user) return navigate('/login');
        try {
            // 后端可以通过 verifyToken 中间件自动获取 req.user.id，这里只需传 bookId
            await API.post('/borrows', { bookId: id });
            alert('Borrowed successfully!');
            navigate('/profile');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to borrow book.');
        }
    };

    const handleReserve = async () => {
        if (!user) return navigate('/login');
        try {
            await API.post('/reservations', { bookId: id });
            alert('Reserved successfully! You will be notified when available.');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to reserve book.');
        }
    };

    if (!book) return <div className="p-4 text-center">Loading book details...</div>;

    return (
        <div className="card shadow-sm border-0 p-4">
            <div className="row">
                <div className="col-md-8">
                    <span className="badge bg-secondary mb-2">{book.category}</span>
                    <h2 className="fw-bold">{book.title}</h2>
                    <p className="text-muted fs-5 mb-2">Author: {book.author}</p>
                    {book.publishYear && <p className="text-muted mb-2">Publish Year: {book.publishYear}</p>}
                    <p className="text-muted mb-2">ISBN: {book.isbn}</p>
                    <p className="text-muted mb-4">Shelf Location: {book.shelfLocation}</p>
                    <div className="p-3 bg-light rounded mb-4">
                        <h5>Availability Status:</h5>
                        <p className="mb-0">Available Stock: <strong>{book.availableStock}</strong> / Total: {book.totalStock}</p>
                    </div>
                    <div className="d-flex gap-3">
                        <button 
                            onClick={handleBorrow} 
                            disabled={book.availableStock <= 0} 
                            className="btn btn-primary px-4"
                        >
                            {book.availableStock > 0 ? 'Borrow Now' : 'Out of Stock'}
                        </button>
                        {book.availableStock === 0 && (
                            <button onClick={handleReserve} className="btn btn-warning text-white px-4">Reserve Book</button>
                        )}
                        <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">Back to List</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;