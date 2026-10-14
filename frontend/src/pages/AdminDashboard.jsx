import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        borrowedBooks: 0,
        availableBooks: 0,
        allBorrows: []
    });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const [booksRes, borrowsRes] = await Promise.all([
                API.get('/books'),
                API.get('/borrows')
            ]);

            const books = booksRes.data || [];
            const borrows = borrowsRes.data || [];

            const total = books.reduce((acc, book) => acc + (book.totalStock || 0), 0);
            const available = books.reduce((acc, book) => acc + (book.availableStock || 0), 0);
            
            // 计算当前真正活跃的借阅数（用于统计卡片）
            const activeBorrowsCount = borrows.filter(b => b.status === 'Borrowed').length;

            setStats({
                totalBooks: total,
                availableBooks: available,
                borrowedBooks: activeBorrowsCount,
                // 保存全量借阅/归还流水，供表格展示
                allBorrows: borrows
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

            {/* card 统计看板 */}
            <div className="row g-3 mb-4">
                {/* card 1: all books */}
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

                {/* card 2: books available for borrowing */}
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

                {/* card 3: number of books currently on loan */}
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

                {/* card 4: utilization rate */}
                <div className="col-md-3">
                    <div className="card card-dark-glass rounded-4 p-3 h-100">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-white-50 small fw-medium d-block mb-1">Utilization Rate</span>
                                <h3 className="fw-bold text-info mb-0">{borrowRate}%</h3>
                            </div>
                            <div className="rounded-circle bg-info-subtle text-info p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                <i className="fa-solid fa-percent fa-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Book Utilization Rate and Quick Access Toolbar */}
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
                            <Link to="/search" className="btn btn-outline-light text-start rounded-3 p-2.5 border-opacity-25">
                                <i className="fa-solid fa-magnifying-glass me-2 text-info"></i>Browse Public Catalog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. All Borrow & Return Activity Table (展示借书与还书的全部历史流水) */}
            <div className="card card-dark-glass rounded-4 overflow-hidden">
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
                            {stats.allBorrows.map(log => {
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
            </div>
        </div>
    );
};

export default AdminDashboard;