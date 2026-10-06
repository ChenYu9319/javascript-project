import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const AdminInventory = () => {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({ title: '', author: '', isbn: '', category: '', totalStock: 1, availableStock: 1, shelfLocation: '' });
    const [editingId, setEditingId] = useState(null);

    const fetchBooks = async () => {
        const res = await API.get('/books');
        setBooks(res.data);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/books/${editingId}`, form);
                alert('Book updated successfully!');
            } else {
                await API.post('/books', form);
                alert('Book added successfully!');
            }
            setForm({ title: '', author: '', isbn: '', category: '', totalStock: 1, availableStock: 1, shelfLocation: '' });
            setEditingId(null);
            fetchBooks();
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed.');
        }
    };

    const handleEdit = (book) => {
        setEditingId(book._id);
        setForm(book);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        try {
            await API.delete(`/books/${id}`);
            fetchBooks();
        } catch (err) {
            alert('Failed to delete book.');
        }
    };

    return (
        <div>
            <h2>Inventory Management</h2>
            <form onSubmit={handleSubmit} className="row g-3 my-3 bg-light p-3 rounded shadow-sm">
                <div className="col-md-3">
                    <input type="text" placeholder="Title" className="form-control" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="col-md-3">
                    <input type="text" placeholder="Author" className="form-control" required value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
                </div>
                <div className="col-md-2">
                    <input type="text" placeholder="ISBN" className="form-control" required value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} />
                </div>
                <div className="col-md-2">
                    <input type="text" placeholder="Category" className="form-control" required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                </div>
                <div className="col-md-2">
                    <input type="text" placeholder="Shelf Location" className="form-control" required value={form.shelfLocation} onChange={e => setForm({ ...form, shelfLocation: e.target.value })} />
                </div>
                <div className="col-md-2">
                    <input type="number" placeholder="Total Stock" className="form-control" required value={form.totalStock} onChange={e => setForm({ ...form, totalStock: Number(e.target.value) })} />
                </div>
                <div className="col-md-2">
                    <input type="number" placeholder="Available Stock" className="form-control" required value={form.availableStock} onChange={e => setForm({ ...form, availableStock: Number(e.target.value) })} />
                </div>
                <div className="col-md-2">
                    <button type="submit" className="btn btn-success w-100">{editingId ? 'Save Changes' : 'Add Book'}</button>
                </div>
            </form>

            <table className="table table-bordered align-middle shadow-sm bg-white">
                <thead className="table-light">
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Category</th>
                        <th>Available / Total</th>
                        <th>Shelf Location</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(b => (
                        <tr key={b._id}>
                            <td>{b.title}</td>
                            <td>{b.author}</td>
                            <td>{b.isbn}</td>
                            <td>{b.category}</td>
                            <td>{b.availableStock} / {b.totalStock}</td>
                            <td>{b.shelfLocation}</td>
                            <td>
                                <button onClick={() => handleEdit(b)} className="btn btn-sm btn-outline-primary me-2">Edit</button>
                                <button onClick={() => handleDelete(b._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminInventory;