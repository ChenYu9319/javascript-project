import React, { useState, useEffect, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from '../auth/Auth';

const MemberProfile = () => {
    const { user } = useContext(AuthContext);
    const [borrows, setBorrows] = useState([]);

    const fetchMyBorrows = async () => {
        try {
            const res = await API.get('/borrows');
            const userId = user?.id || user?._id;
            setBorrows(res.data.filter(item => item.userId?._id === userId));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user) fetchMyBorrows();
    }, [user]);

    const handleReturn = async (borrowId) => {
        try {
            await API.put(`/borrows/${borrowId}/return`);
            alert('Book returned successfully!');
            fetchMyBorrows();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to return book.');
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h2>My Borrowing Center</h2>
            <p className="text-muted">User: {user.username} | Library Card No: {user.cardNo}</p>
            <h4 className="mt-4 mb-3">Borrowing History & Current Active Borrows</h4>
            <table className="table table-hover align-middle shadow-sm bg-white rounded">
                <thead className="table-light">
                    <tr>
                        <th>Book Title</th>
                        <th>Borrow Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {borrows.map(log => (
                        <tr key={log._id}>
                            <td>{log.bookId?.title || 'Unknown Book'}</td>
                            <td>{new Date(log.borrowDate).toLocaleDateString()}</td>
                            <td>{new Date(log.dueDate).toLocaleDateString()}</td>
                            <td>
                                <span className={`badge ${log.status === 'Returned' ? 'bg-secondary' : 'bg-success'}`}>
                                    {log.status === 'Returned' ? 'Returned' : 'Borrowed'}
                                </span>
                            </td>
                            <td>
                                {log.status === 'Borrowed' && (
                                    <button onClick={() => handleReturn(log._id)} className="btn btn-outline-danger btn-sm">Return Book</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MemberProfile;