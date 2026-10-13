import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../auth/Auth';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get(`/books/${id}`)
            .then(res => {
                setBook(res.data);
            })
            .catch(err => {
                console.error('Failed to fetch book detail:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleBorrow = async () => {
        if (!user) return navigate('/login');
        
        // 前端双重保险：如果是管理员直接提示并拦截
        if (user.role === 'admin') {
            alert('Administrators are not permitted to borrow books.');
            return;
        }

        try {
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

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-info" role="status"></div>
                <p className="mt-2 text-white-50">Loading Book Details...</p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="card card-dark-glass rounded-4 text-center py-5 my-4 container">
                <i className="fa-solid fa-circle-exclamation fa-3x text-warning mb-3"></i>
                <h5 className="fw-bold text-white">Book Not Found</h5>
                <p className="text-white-50 small mb-3">The requested book could not be found in our database.</p>
                <div>
                    <button onClick={() => navigate('/search')} className="btn btn-primary-gradient rounded-pill px-4">
                        Back to Catalog
                    </button>
                </div>
            </div>
        );
    }

    const isAvailable = book.availableStock > 0;
    const isAdmin = user?.role === 'admin';

    return (
        <div className="container py-2">
            {/* 返回按钮 */}
            <button onClick={() => navigate(-1)} className="btn btn-outline-light rounded-pill mb-4 px-3 border-opacity-25 text-white-50">
                <i className="fa-solid fa-arrow-left me-2"></i>Back
            </button>

            {/* 主内容卡片 */}
            <div className="card card-dark-glass rounded-4 p-4">
                <div className="row g-4 align-items-center">
                    {/* 左侧图书大图章 */}
                    <div className="col-lg-4 text-center border-end-lg">
                        <div className="rounded-4 bg-primary-subtle text-primary p-5 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '180px', height: '220px' }}>
                            <i className="fa-solid fa-book-open-reader fa-5x"></i>
                        </div>
                        <div>
                            <span className="badge bg-white bg-opacity-10 text-white border border-white border-opacity-10 px-3 py-2 rounded-pill fs-6">
                                <i className="fa-solid fa-bookmark me-1 text-info"></i>{book.category}
                            </span>
                        </div>
                    </div>

                    {/* 右侧详细属性 */}
                    <div className="col-lg-8">
                        <h2 className="fw-bold text-white mb-2">{book.title}</h2>
                        <p className="text-white-50 fs-5 mb-4">
                            <i className="fa-solid fa-user-pen me-2 text-info"></i>Author: <span className="text-white fw-medium">{book.author}</span>
                        </p>

                        {/* 元数据卡片列表 */}
                        <div className="row g-3 mb-4">
                            <div className="col-sm-6">
                                <div className="p-3 rounded-3" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                    <span className="text-white-50 small d-block mb-1">
                                        <i className="fa-solid fa-barcode me-1 text-info"></i>ISBN Number
                                    </span>
                                    <span className="fw-bold text-white">{book.isbn}</span>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="p-3 rounded-3" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                    <span className="text-white-50 small d-block mb-1">
                                        <i className="fa-solid fa-location-dot me-1 text-info"></i>Shelf Location
                                    </span>
                                    <span className="fw-bold text-white">{book.shelfLocation}</span>
                                </div>
                            </div>
                        </div>

                        {/* 库存与状态评估 */}
                        <div className="card border-0 p-3 rounded-4 mb-4" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="text-white-50 small d-block mb-1">Availability Status</span>
                                    <h5 className="mb-0 fw-bold">
                                        <span className={isAvailable ? 'text-success' : 'text-danger'}>
                                            {isAvailable ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </h5>
                                </div>
                                <div className="text-end">
                                    <span className="text-white-50 small d-block mb-1">Available Quantity</span>
                                    <span className="fs-5 fw-bold text-white">{book.availableStock}</span>
                                    <span className="text-white-50"> / {book.totalStock}</span>
                                </div>
                            </div>
                        </div>

                        {/* 操作按钮组 / 管理员提示 */}
                        <div className="d-flex gap-3 align-items-center">
                            {isAdmin ? (
                                <div className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-2 rounded-pill fs-6">
                                    <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                    Administrators are not permitted to borrow books
                                </div>
                            ) : (
                                <>
                                    <button 
                                        onClick={handleBorrow} 
                                        disabled={!isAvailable} 
                                        className={`btn ${isAvailable ? 'btn-primary-gradient' : 'btn-secondary'} rounded-pill px-4 py-2.5 fw-medium shadow-sm`}
                                    >
                                        <i className="fa-solid fa-hand-holding-hand me-2"></i>
                                        {isAvailable ? 'Borrow Now' : 'Out of Stock'}
                                    </button>

                                    {!isAvailable && (
                                        <button onClick={handleReserve} className="btn btn-warning text-white rounded-pill px-4 py-2.5 fw-medium shadow-sm">
                                            <i className="fa-solid fa-clock me-2"></i>Reserve Book
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;