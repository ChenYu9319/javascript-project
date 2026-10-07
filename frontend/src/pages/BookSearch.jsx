import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import BookCard from '../components/BookCard';

const BookSearch = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);

    const fetchBooks = async () => {
        try {
            const res = await API.get('/books', {
                params: { keyword, category, availableOnly }
            });
            setBooks(res.data);
        } catch (err) {
            console.error('Failed to fetch books:', err);
        }
    };

    useEffect(() => {
        // 修正：将 /books/category 改为 /books/categories
        API.get('/books/categories')
            .then(res => setCategories(res.data))
            .catch(() => {});
            
        fetchBooks();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooks();
    };

    return (
        <div>
            <h2 className="mb-4">Book Search</h2>
            <form onSubmit={handleSearch} className="row g-3 mb-4 bg-light p-3 rounded shadow-sm">
                <div className="col-md-4">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search by title or author..."
                        value={keyword} 
                        onChange={e => setKeyword(e.target.value)} 
                    />
                </div>
                <div className="col-md-3">
                    <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="col-md-3 d-flex align-items-center">
                    <div className="form-check">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="avail"
                            checked={availableOnly} 
                            onChange={e => setAvailableOnly(e.target.checked)} 
                        />
                        <label className="form-check-label" htmlFor="avail">Available Stock Only</label>
                    </div>
                </div>
                <div className="col-md-2">
                    <button type="submit" className="btn btn-primary w-100">Search</button>
                </div>
            </form>

            <div className="row row-cols-1 row-cols-md-3 g-4">
                {books.map(book => (
                    <div className="col" key={book._id}>
                        <BookCard book={book} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookSearch;