import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        borrowedBooks: 0,
        availableBooks: 0,
        allBorrows: [],
        allReservations: []
    });
    const [loading, setLoading] = useState(true);

    // 分页相关的 State（每页 10 个）
    const [borrowPage, setBorrowPage] = useState(1);
    const [reservationPage, setReservationPage] = useState(1);
    const itemsPerPage = 10;

    const fetchDashboardData = async () => {
        try {
            const [booksRes, borrowsRes, reservationsRes] = await Promise.all([
                API.get('/books'),
                API.get('/borrows'),
                API.get('/reservations')
            ]);

            const books = booksRes.data || [];
            const borrows = borrowsRes.data || [];
            const reservations = reservationsRes.data || [];

            const total = books.reduce((acc, book) => acc + (book.totalStock || 0), 0);
            const available = books.reduce((acc, book) => acc + (book.availableStock || 0), 0);
            const activeBorrowsCount = borrows.filter(b => b.status === 'Borrowed').length;

            setStats({
                totalBooks: total,
                availableBooks: available,
                borrowedBooks: activeBorrowsCount,
                allBorrows: borrows,
                allReservations: reservations
            });
        } catch (err) {
            console.error('Failed to load dashboard statistics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const borrowRate = stats.totalBooks > 0 
        ? Math.round((stats.borrowedBooks / stats.totalBooks) * 100) 
        : 0;

    // 1. 借阅日志分页切片计算
    const totalBorrowPages = Math.ceil(stats.allBorrows.length / itemsPerPage) || 1;
    const currentBorrows = stats.allBorrows.slice(
        (borrowPage - 1) * itemsPerPage,
        borrowPage * itemsPerPage
    );

    // 2. 预约日志分页切片计算
    const totalReservationPages = Math.ceil(stats.allReservations.length / itemsPerPage) || 1;
    const currentReservations = stats.allReservations.slice(
        (reservationPage - 1) * itemsPerPage,
        reservationPage * itemsPerPage
    );

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-info" role="status"></div>
                <p className="mt-2 text-white-50">Loading Dashboard Analytics...</p>
            </div>
        );
    }

    return (
        <div className="container py-2">
            {/* 页头 */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-white mb-1">
                        <i className="fa-solid fa-chart-pie me-2" style={{ color: "#38bdf8" }}></i>
                        Admin Overview
                    </h2>
                    <p className="text-white-50 small mb-0">System performance, statistics and library activity logs.</p>
                </div>
                <Link to="/admin/inventory" className="btn btn-primary-gradient rounded-pill px-4 shadow-sm">
                    <i className="fa-solid fa-boxes-stacked me-2"></i>Manage Inventory
                </Link>
            </div>

            {/* 1. Card 统计看板 */}
            <div className="row g-3 mb-4">
                {/* Total Stock */}
                <div className="col-md-3">
                    <div className="card card-dark-glass rounded-4 p-3 h-100">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-white-50 small fw-medium d-block mb-1">Total Stock</span>
                                <h3 className="fw-bold text-white mb-0">{stats.totalBooks}</h3>
                            </div>
                            <div className="rounded-circle bg-primary-subtle text-primary p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                <i className="fa-solid fa-book fa-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Books */}
                <div className="col-md-3">
                    <div className="card card-dark-glass rounded-4 p-3 h-100">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-white-50 small fw-medium d-block mb-1">Available Books</span>
                                <h3 className="fw-bold text-success mb-0">{stats.availableBooks}</h3>
                            </div>
                            <div className="rounded-circle bg-success-subtle text-success p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                <i className="fa-solid fa-circle-check fa-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Borrows */}
                <div className="col-md-3">
                    <div className="card card-dark-glass rounded-4 p-3 h-100">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-white-50 small fw-medium d-block mb-1">Active Borrows</span>
                                <h3 className="fw-bold text-warning mb-0">{stats.borrowedBooks}</h3>
                            </div>
                            <div className="rounded-circle bg-warning-subtle text-warning p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                <i className="fa-solid fa-hand-holding-hand fa-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Reservations */}
                <div className="col-md-3">
                    <div className="card card-dark-glass rounded-4 p-3 h-100">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-white-50 small fw-medium d-block mb-1">Pending Reservations</span>
                                <h3 className="fw-bold text-info mb-0">{stats.allReservations.length}</h3>
                            </div>
                            <div className="rounded-circle bg-info-subtle text-info p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                <i className="fa-solid fa-clock fa-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. 图书利用率与快捷工具栏（已加入 View Member Directory 快捷入口） */}
            <div className="row g-4 mb-4">
                <div className="col-md-8">
                    <div className="card card-dark-glass rounded-4 p-4 h-100">
                        <h5 className="fw-bold text-white mb-3">
                            <i className="fa-solid fa-chart-line text-info me-2"></i>Library Borrowing Capacity
                        </h5>
                        <p className="text-white-50 small mb-2">
                            Percentage of books currently checked out by active members ({stats.borrowedBooks} / {stats.totalBooks}).
                        </p>
                        <div className="progress rounded-pill mb-3" style={{ height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <div 
                                className="progress-bar bg-info progress-bar-striped progress-bar-animated" 
                                role="progressbar" 
                                style={{ width: `${borrowRate}%` }}
                            >
                                {borrowRate}%
                            </div>
                        </div>
                        <div className="d-flex justify-content-between small text-white-50">
                            <span><i className="fa-solid fa-circle text-info me-1"></i>Borrowed ({stats.borrowedBooks})</span>
                            <span><i className="fa-solid fa-circle text-secondary me-1"></i>Available Stock ({stats.availableBooks})</span>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card card-dark-glass rounded-4 p-4 h-100">
                        <h5 className="fw-bold text-white mb-3">
                            <i className="fa-solid fa-bolt text-warning me-2"></i>Quick Actions
                        </h5>
                        <div className="d-grid gap-2">
                            <Link to="/admin/inventory" className="btn btn-outline-light text-start rounded-3 p-2.5 border-opacity-25">
                                <i className="fa-solid fa-square-plus me-2 text-info"></i>Add New Book Item
                            </Link>
                            {/* 新增：查看会员列表快捷入口 */}
                            <Link to="/admin/users" className="btn btn-outline-light text-start rounded-3 p-2.5 border-opacity-25">
                                <i className="fa-solid fa-users me-2 text-info"></i>View Member Directory
                            </Link>
                            <Link to="/search" className="btn btn-outline-light text-start rounded-3 p-2.5 border-opacity-25">
                                <i className="fa-solid fa-magnifying-glass me-2 text-info"></i>Browse Public Catalog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. 借阅与还书历史流水表（带分页） */}
            <div className="card card-dark-glass rounded-4 overflow-hidden mb-4">
                <div className="card-header bg-transparent border-bottom border-white border-opacity-10 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold text-white mb-0">
                        <i className="fa-solid fa-clock-rotate-left text-info me-2"></i>Borrow & Return Activity Logs
                    </h5>
                    <span className="badge bg-white bg-opacity-10 text-white border border-white border-opacity-10">
                        Total Logs: {stats.allBorrows.length}
                    </span>
                </div>
                <div className="table-responsive">
                    <table className="table table-dark-glass align-middle mb-0">
                        <thead>
                            <tr>
                                <th className="ps-4">Book Title</th>
                                <th>Borrower</th>
                                <th>Borrow Date</th>
                                <th>Due / Return Date</th>
                                <th className="text-end pe-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBorrows.map(log => {
                                const isReturned = log.status === 'Returned';
                                return (
                                    <tr key={log._id}>
                                        <td className="ps-4 fw-medium text-white">{log.bookId?.title || 'Unknown Book'}</td>
                                        <td className="text-white-50">
                                            <i className="fa-solid fa-user me-1 text-info opacity-75"></i>
                                            {log.userId?.username || 'Member'}
                                        </td>
                                        <td className="text-white-50 small">
                                            {log.borrowDate ? new Date(log.borrowDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="text-white-50 small">
                                            {isReturned ? (
                                                <span className="text-success">
                                                    <i className="fa-solid fa-check me-1"></i>
                                                    Returned: {log.returnDate ? new Date(log.returnDate).toLocaleDateString() : 'N/A'}
                                                </span>
                                            ) : (
                                                <span className="text-warning">
                                                    Due: {log.dueDate ? new Date(log.dueDate).toLocaleDateString() : '-'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-end pe-4">
                                            <span className={`badge rounded-pill ${isReturned ? 'bg-secondary bg-opacity-25 text-white-50 border border-secondary border-opacity-25' : 'bg-success bg-opacity-25 text-success border border-success border-opacity-25'}`}>
                                                {isReturned ? 'Returned' : 'Active Borrow'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {stats.allBorrows.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-white-50">
                                        No borrowing or return logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 借阅日志分页控制条 */}
                {totalBorrowPages > 1 && (
                    <div className="card-footer bg-transparent border-top border-white border-opacity-10 py-3 px-4 d-flex justify-content-between align-items-center">
                        <span className="text-white-50 small">
                            Page {borrowPage} of {totalBorrowPages}
                        </span>
                        <div className="btn-group">
                            <button 
                                className="btn btn-outline-light btn-sm px-3 border-opacity-25 rounded-start-pill"
                                disabled={borrowPage === 1}
                                onClick={() => setBorrowPage(prev => Math.max(prev - 1, 1))}
                            >
                                <i className="fa-solid fa-chevron-left me-1"></i> Prev
                            </button>
                            <button 
                                className="btn btn-outline-light btn-sm px-3 border-opacity-25 rounded-end-pill"
                                disabled={borrowPage === totalBorrowPages}
                                onClick={() => setBorrowPage(prev => Math.min(prev + 1, totalBorrowPages))}
                            >
                                Next <i className="fa-solid fa-chevron-right ms-1"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. 全馆图书预约只读列表（带分页） */}
            <div className="card card-dark-glass rounded-4 overflow-hidden">
                <div className="card-header bg-transparent border-bottom border-white border-opacity-10 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold text-white mb-0">
                        <i className="fa-solid fa-list-check text-warning me-2"></i>Book Reservation Overview (Read-Only)
                    </h5>
                    <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">
                        Total Reservations: {stats.allReservations.length}
                    </span>
                </div>
                <div className="table-responsive">
                    <table className="table table-dark-glass align-middle mb-0">
                        <thead>
                            <tr>
                                <th className="ps-4">Book Title</th>
                                <th>Reserved By</th>
                                <th>Reservation Date</th>
                                <th>Current Stock Status</th>
                                <th className="text-end pe-4">Reservation Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReservations.map(resv => {
                                const bookTitle = resv.bookId?.title || 'Unknown Book';
                                const memberName = resv.userId?.username || 'Member';
                                const cardNo = resv.userId?.cardNo ? ` (${resv.userId.cardNo})` : '';
                                const availStock = resv.bookId?.availableStock ?? 0;

                                return (
                                    <tr key={resv._id}>
                                        <td className="ps-4 fw-medium text-white">{bookTitle}</td>
                                        <td className="text-white-50">
                                            <i className="fa-solid fa-user me-1 text-info opacity-75"></i>
                                            {memberName}{cardNo}
                                        </td>
                                        <td className="text-white-50 small">
                                            {resv.reservedAt ? new Date(resv.reservedAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td>
                                            <span className={`badge ${availStock > 0 ? 'bg-success bg-opacity-25 text-success' : 'bg-danger bg-opacity-25 text-danger'}`}>
                                                {availStock > 0 ? `In Stock (${availStock})` : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <span className="badge bg-warning text-dark fw-bold rounded-pill px-3 py-1">
                                                {resv.status || 'Active'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {stats.allReservations.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-white-50">
                                        No reservation records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 预约日志分页控制条 */}
                {totalReservationPages > 1 && (
                    <div className="card-footer bg-transparent border-top border-white border-opacity-10 py-3 px-4 d-flex justify-content-between align-items-center">
                        <span className="text-white-50 small">
                            Page {reservationPage} of {totalReservationPages}
                        </span>
                        <div className="btn-group">
                            <button 
                                className="btn btn-outline-light btn-sm px-3 border-opacity-25 rounded-start-pill"
                                disabled={reservationPage === 1}
                                onClick={() => setReservationPage(prev => Math.max(prev - 1, 1))}
                            >
                                <i className="fa-solid fa-chevron-left me-1"></i> Prev
                            </button>
                            <button 
                                className="btn btn-outline-light btn-sm px-3 border-opacity-25 rounded-end-pill"
                                disabled={reservationPage === totalReservationPages}
                                onClick={() => setReservationPage(prev => Math.min(prev + 1, totalReservationPages))}
                            >
                                Next <i className="fa-solid fa-chevron-right ms-1"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;