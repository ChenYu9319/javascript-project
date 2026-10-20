import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import BookCard from '../components/BookCard';

const BookSearch = () => {
    const [allBooks, setAllBooks] = useState([]);       // 存储从后端获取的原始完整书籍列表
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1. 页面加载时一次性获取所有书籍和分类
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [booksRes, catRes] = await Promise.all([
                    API.get('/books'),
                    API.get('/books/categories')
                ]);
                setAllBooks(booksRes.data || []);
                setCategories(catRes.data || []);
            } catch (err) {
                console.error('Failed to fetch catalog data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // 2. 前端实时过滤逻辑（每打一个字、切分类或点开关，瞬间响应）
    const filteredBooks = allBooks.filter(book => {
        const term = keyword.toLowerCase();
        
        // 匹配书名、作者或 ISBN
        const matchesKeyword = 
            (book.title && book.title.toLowerCase().includes(term)) ||
            (book.author && book.author.toLowerCase().includes(term)) ||
            (book.isbn && book.isbn.toLowerCase().includes(term));

        // 匹配分类
        const matchesCategory = category === '' || book.category === category;

        // 匹配可用库存
        const matchesStock = !availableOnly || (book.availableStock > 0);

        return matchesKeyword && matchesCategory && matchesStock;
    });

    const handleReset = () => {
        setKeyword('');
        setCategory('');
        setAvailableOnly(false);
    };

    return (
        <div className="container py-2" style={{ background: "transparent" }}>
            {/* 页头标题区域 */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-white mb-1">
                        <i className="fa-solid fa-magnifying-glass me-2" style={{ color: "#38bdf8" }}></i>
                        Book Catalog
                    </h2>
                    <p className="text-white-50 small mb-0">Explore our digital collection, search by title, author or category.</p>
                </div>
                <span className="badge bg-white bg-opacity-10 text-white border border-white border-opacity-10 rounded-pill px-3 py-2">
                    <i className="fa-solid fa-book-open me-1 text-info"></i> {filteredBooks.length} Books Found
                </span>
            </div>

            {/* 实时搜索与筛选栏（无需点击 Search 按钮，输入即生效） */}
            <div className="card card-dark-glass rounded-4 p-3 mb-4">
                <div className="row g-3 align-items-center">
                    {/* 关键词实时搜索框 */}
                    <div className="col-lg-4 col-md-6">
                        <div className="input-group">
                            <span className="input-group-text border-end-0 text-white-50 rounded-start-pill ps-3" style={{ background: "rgba(15, 23, 42, 0.4)", borderColor: "rgba(255, 255, 255, 0.15)" }}>
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </span>
                            <input 
                                type="text" 
                                className="form-control border-start-0 rounded-end-pill ps-2 text-white bg-transparent" 
                                placeholder="Search title, author or ISBN..."
                                value={keyword} 
                                onChange={e => setKeyword(e.target.value)} 
                            />
                        </div>
                    </div>

                    {/* 分类下拉菜单 */}
                    <div className="col-lg-3 col-md-6">
                        <div className="input-group">
                            <span className="input-group-text border-end-0 text-white-50 rounded-start-pill ps-3" style={{ background: "rgba(15, 23, 42, 0.4)", borderColor: "rgba(255, 255, 255, 0.15)" }}>
                                <i className="fa-solid fa-layer-group"></i>
                            </span>
                            <select 
                                className="form-select border-start-0 rounded-end-pill text-white bg-dark" 
                                value={category} 
                                onChange={e => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* 可用库存开关 */}
                    <div className="col-lg-3 col-md-6 d-flex align-items-center">
                        <div className="form-check form-switch ms-2">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="availSwitch"
                                checked={availableOnly} 
                                onChange={e => setAvailableOnly(e.target.checked)} 
                            />
                            <label className="form-check-label fw-medium text-white-50 small ms-1" htmlFor="availSwitch">
                                Available Stock Only
                            </label>
                        </div>
                    </div>

                    {/* 重置按钮 */}
                    <div className="col-lg-2 col-md-6">
                        {(keyword || category || availableOnly) && (
                            <button 
                                type="button" 
                                onClick={handleReset} 
                                className="btn btn-outline-light rounded-pill w-100 border-opacity-25 text-white-50 py-2"
                                style={{ fontSize: '0.85rem' }}
                            >
                                <i className="fa-solid fa-rotate-left me-1"></i> Reset Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 加载状态 */}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-info" role="status"></div>
                    <p className="mt-2 text-white-50">Loading catalog...</p>
                </div>
            )}

            {/* 图书网格展示 */}
            {!loading && (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {filteredBooks.map(book => (
                        <div className="col" key={book._id}>
                            <BookCard book={book} />
                        </div>
                    ))}
                </div>
            )}

            {/* 空搜索结果提示 */}
            {!loading && filteredBooks.length === 0 && (
                <div className="card card-dark-glass rounded-4 text-center py-5 my-4">
                    <div className="card-body">
                        <div className="rounded-circle bg-white bg-opacity-10 d-inline-flex p-4 mb-3 text-info">
                            <i className="fa-solid fa-book-open-reader fa-3x"></i>
                        </div>
                        <h5 className="fw-bold text-white mb-1">No Books Found</h5>
                        <p className="text-white-50 small mb-3">We couldn't find any books matching your search filters.</p>
                        <button onClick={handleReset} className="btn btn-outline-light rounded-pill px-4 border-opacity-25">
                            Clear Search Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookSearch;