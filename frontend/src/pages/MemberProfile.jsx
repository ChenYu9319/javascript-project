import React, { useState, useEffect, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from '../auth/Auth';

const MemberProfile = () => {
    const { user } = useContext(AuthContext);
    const [borrows, setBorrows] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('borrows'); // 'borrows' 或 'reservations'
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchData = async () => {
        setLoading(true);
        try {
            const userId = user?.id || user?._id;
            
            // 1. 获取借阅记录
            const borrowsRes = await API.get('/borrows');
            if (Array.isArray(borrowsRes.data)) {
                const userLogs = borrowsRes.data.filter(item => {
                    const idInItem = item.userId?._id || item.userId;
                    return !idInItem || idInItem === userId;
                });
                setBorrows(userLogs);
            }

            // 2. 获取预约记录
            const resRes = await API.get('/reservations');
            if (Array.isArray(resRes.data)) {
                const userResv = resRes.data.filter(item => {
                    const idInItem = item.userId?._id || item.userId;
                    return !idInItem || idInItem === userId;
                });
                setReservations(userResv);
            }
        } catch (err) {
            console.error('Failed to fetch profile data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const handleReturn = async (borrowId, bookTitle) => {
        if (!window.confirm(`Are you sure you want to return "${bookTitle || 'this book'}"?`)) return;

        try {
            await API.put(`/borrows/${borrowId}/return`);
            alert('Book returned successfully!');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to return book.');
        }
    };

    const handleCancelReservation = async (reservationId, bookTitle) => {
        if (!window.confirm(`Are you sure you want to cancel your reservation for "${bookTitle || 'this book'}"?`)) return;

        try {
            await API.delete(`/reservations/${reservationId}`);
            alert('Reservation cancelled successfully!');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel reservation.');
        }
    };

    if (!user) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-info me-2" role="status"></div>
                <span className="text-white-50">Loading user profile...</span>
            </div>
        );
    }

    const activeBorrowsCount = borrows.filter(log => log.status === 'Borrowed').length;
    const returnedCount = borrows.filter(log => log.status === 'Returned').length;
    const activeReservationsCount = reservations.filter(res => res.status === 'Active' || res.status === 'Pending').length;

    const filteredBorrows = borrows.filter(log => {
        if (filterStatus === 'Borrowed') return log.status === 'Borrowed';
        if (filterStatus === 'Returned') return log.status === 'Returned';
        return true;
    });

    return (
        <div className="container py-2">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-user-check" style={{ color: "#38bdf8" }}></i>
                        My Library Portal
                    </h2>
                    <p className="text-white-50 small mb-0">
                        User: <strong className="text-white">{user.username}</strong> | Card No: <span className="badge bg-white bg-opacity-10 text-white border border-white border-opacity-10 ms-1">{user.cardNo || 'N/A'}</span>
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 rounded-pill px-3 py-2 fs-6">
                        <i className="fa-solid fa-book-reader me-1"></i> Active Borrows: {activeBorrowsCount}
                    </span>
                    <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 rounded-pill px-3 py-2 fs-6">
                        <i className="fa-solid fa-clock me-1"></i> Reservations: {activeReservationsCount}
                    </span>
                </div>
            </div>

            {/* Main Tabs (切换 借阅记录 / 预约记录) */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="btn-group p-1 rounded-pill" style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                    <button 
                        className={`btn btn-sm rounded-pill px-4 ${activeTab === 'borrows' ? 'btn-primary-gradient' : 'btn-link text-white-50 text-decoration-none border-0'}`}
                        onClick={() => setActiveTab('borrows')}
                    >
                        <i className="fa-solid fa-book-bookmark me-1.5"></i> My Borrows ({borrows.length})
                    </button>
                    <button 
                        className={`btn btn-sm rounded-pill px-4 ${activeTab === 'reservations' ? 'btn-primary-gradient' : 'btn-link text-white-50 text-decoration-none border-0'}`}
                        onClick={() => setActiveTab('reservations')}
                    >
                        <i className="fa-solid fa-clock-rotate-left me-1.5"></i> My Reservations ({reservations.length})
                    </button>
                </div>

                <button 
                    onClick={fetchData} 
                    className="btn btn-outline-light rounded-circle p-2 text-white-50 border-opacity-25" 
                    style={{ width: '38px', height: '38px' }} 
                    title="Refresh Records"
                >
                    <i className="fa-solid fa-rotate-right"></i>
                </button>
            </div>

            {/* 如果当前在 Borrows 标签页 */}
            {activeTab === 'borrows' && (
                <>
                    {/* 筛选栏 */}
                    <div className="mb-3">
                        <div className="btn-group p-1 rounded-pill bg-dark bg-opacity-50 border border-white border-opacity-10">
                            <button className={`btn btn-sm rounded-pill px-3 ${filterStatus === 'All' ? 'btn-info text-dark fw-bold' : 'btn-link text-white-50 text-decoration-none border-0'}`} onClick={() => setFilterStatus('All')}>All ({borrows.length})</button>
                            <button className={`btn btn-sm rounded-pill px-3 ${filterStatus === 'Borrowed' ? 'btn-info text-dark fw-bold' : 'btn-link text-white-50 text-decoration-none border-0'}`} onClick={() => setFilterStatus('Borrowed')}>Active ({activeBorrowsCount})</button>
                            <button className={`btn btn-sm rounded-pill px-3 ${filterStatus === 'Returned' ? 'btn-info text-dark fw-bold' : 'btn-link text-white-50 text-decoration-none border-0'}`} onClick={() => setFilterStatus('Returned')}>Returned ({returnedCount})</button>
                        </div>
                    </div>

                    <div className="card card-dark-glass rounded-4 overflow-hidden">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-info" role="status"></div>
                                <p className="mt-2 text-white-50">Loading borrowing records...</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-dark-glass align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th className="ps-4">Book Title</th>
                                            <th>Borrow Date</th>
                                            <th>Due Date</th>
                                            <th>Status</th>
                                            <th className="text-end pe-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBorrows.map(log => {
                                            const isBorrowed = log.status === 'Borrowed';
                                            const title = log.bookId?.title || 'Unknown Book';
                                            return (
                                                <tr key={log._id}>
                                                    <td className="ps-4 fw-bold text-white">
                                                        <i className="fa-solid fa-book text-info opacity-75 me-2"></i>{title}
                                                    </td>
                                                    <td className="text-white-50 small">{log.borrowDate ? new Date(log.borrowDate).toLocaleDateString() : '-'}</td>
                                                    <td className="text-white-50 small">{log.dueDate ? new Date(log.dueDate).toLocaleDateString() : '-'}</td>
                                                    <td>
                                                        <span className={`badge rounded-pill px-3 py-1.5 ${isBorrowed ? 'bg-success bg-opacity-25 text-success border border-success border-opacity-25' : 'bg-secondary bg-opacity-25 text-white-50'}`}>
                                                            {isBorrowed ? 'Borrowed' : 'Returned'}
                                                        </span>
                                                    </td>
                                                    <td className="text-end pe-4">
                                                        {isBorrowed ? (
                                                            <button onClick={() => handleReturn(log._id, title)} className="btn btn-outline-danger btn-sm rounded-pill px-3 border-opacity-25">
                                                                <i className="fa-solid fa-arrow-rotate-left me-1"></i> Return Book
                                                            </button>
                                                        ) : (
                                                            <span className="text-white-50 small"><i className="fa-solid fa-check me-1"></i> Completed</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {filteredBorrows.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5 text-white-50">
                                                    <i className="fa-solid fa-folder-open fa-2x mb-2 d-block opacity-50"></i>
                                                    No borrowing history found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}

            {activeTab === 'reservations' && (
                <div className="card card-dark-glass rounded-4 overflow-hidden">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-info" role="status"></div>
                            <p className="mt-2 text-white-50">Loading reservations...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-dark-glass align-middle mb-0">
                               <thead>
                                    <tr>
                                        <th className="ps-4">Book Title & Author</th>
                                        <th>ISBN / Shelf</th>
                                        <th>Reservation Date</th>
                                        <th>Status</th>
                                        <th className="text-end pe-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.map(resv => {
                                        const title = resv.bookId?.title || 'Unknown Book';
                                        const author = resv.bookId?.author || 'Unknown Author';
                                        const isbn = resv.bookId?.isbn || '-';
                                        const shelf = resv.bookId?.shelfLocation || '-';
                                        const isActive = resv.status === 'Active' || resv.status === 'Pending';

                                        return (
                                            <tr key={resv._id}>
                                                <td className="ps-4">
                                                    <div className="fw-bold text-white">{title}</div>
                                                    <div className="text-white-50 small">{author}</div>
                                                </td>
                                                <td className="text-white-50 small">
                                                    <div>{isbn}</div>
                                                    <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 mt-1">{shelf}</span>
                                                </td>
                                                <td className="text-white-50 small">
                                                    <i className="fa-regular fa-calendar me-1"></i>
                                                    {resv.reservedAt ? new Date(resv.reservedAt).toLocaleDateString() : '-'}
                                                </td>
                                                <td>
                                                    <span className={`badge rounded-pill px-3 py-1.5 ${isActive ? 'bg-warning bg-opacity-25 text-warning border border-warning border-opacity-25' : 'bg-secondary bg-opacity-25 text-white-50'}`}>
                                                        {resv.status}
                                                    </span>
                                                </td>
                                                <td className="text-end pe-4">
                                                    {isActive ? (
                                                        <button 
                                                            onClick={() => handleCancelReservation(resv._id, title)} 
                                                            className="btn btn-outline-danger btn-sm rounded-pill px-3 border-opacity-25"
                                                        >
                                                            <i className="fa-solid fa-xmark me-1"></i> Cancel Reservation
                                                        </button>
                                                    ) : (
                                                        <span className="text-white-50 small">Closed</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {reservations.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-white-50">
                                                <i className="fa-solid fa-clock fa-2x mb-2 d-block opacity-50"></i>
                                                No active book reservations found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MemberProfile;