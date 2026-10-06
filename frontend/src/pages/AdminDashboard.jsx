import React, { useEffect, useState } from 'react';
import API from '../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalBooks: 0, totalUsers: 0, activeBorrows: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [booksRes, borrowsRes] = await Promise.all([
                    API.get('/books'),
                    API.get('/borrows')
                ]);
                
                const activeBorrowsCount = borrowsRes.data.filter(b => b.status === 'Borrowed').length;
                setStats({
                    totalBooks: booksRes.data.length,
                    activeBorrows: activeBorrowsCount
                });
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h2 className="mb-4">Admin Dashboard</h2>
            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card bg-primary text-white p-3 shadow-sm border-0">
                        <div className="card-body">
                            <h5>Total Book Titles</h5>
                            <h2 className="fw-bold">{stats.totalBooks} Titles</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card bg-success text-white p-3 shadow-sm border-0">
                        <div className="card-body">
                            <h5>Currently Borrowed</h5>
                            <h2 className="fw-bold">{stats.activeBorrows} Books</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;