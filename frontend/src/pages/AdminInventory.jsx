import React, { useState, useEffect } from "react";
import API from "../utils/api";

const AdminInventory = () => {
    const [books, setBooks] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        isbn: "",
        category: "",
        shelfLocation: "",
        totalStock: 1,
        availableStock: 1,
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState(null);

    const fetchBooks = async () => {
        try {
            const res = await API.get("/books");
            setBooks(res.data);
        } catch (err) {
            console.error("Failed to fetch inventory:", err);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // 普通文本输入框的处理（用于 Title, Author, ISBN 等）
    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 纯按钮控制的库存步进函数
    const handleAddStep = (field, step, isEdit = false) => {
        if (isEdit) {
            setEditFormData((prev) => {
                const currentVal = Number(prev[field]) || 0;
                let newVal = currentVal + step;
                if (newVal < (field === "availableStock" ? 0 : 1)) newVal = field === "availableStock" ? 0 : 1;
                if (field === "totalStock" && newVal < Number(prev.availableStock)) {
                    newVal = Number(prev.availableStock);
                }
                return { ...prev, [field]: newVal };
            });
        } else {
            setFormData((prev) => {
                const currentVal = Number(prev[field]) || 0;
                let newVal = currentVal + step;
                if (newVal < (field === "availableStock" ? 0 : 1)) newVal = field === "availableStock" ? 0 : 1;
                if (field === "totalStock" && newVal < Number(prev.availableStock)) {
                    newVal = Number(prev.availableStock);
                }
                return { ...prev, [field]: newVal };
            });
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/books", formData);
            alert("Book added successfully!");
            setFormData({
                title: "",
                author: "",
                isbn: "",
                category: "",
                shelfLocation: "",
                totalStock: 1,
                availableStock: 1,
            });
            fetchBooks();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add book.");
        }
    };

    const handleOpenEditModal = (book) => {
        setEditFormData({ ...book });
        setIsEditModalOpen(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        
        if (editFormData.availableStock > editFormData.totalStock) {
            alert("Available stock cannot exceed total stock.");
            return;
        }

        try {
            await API.put(`/books/${editFormData._id}`, editFormData);
            alert("Book updated successfully!");
            setIsEditModalOpen(false);
            setEditFormData(null);
            fetchBooks();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update book.");
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
        try {
            await API.delete(`/books/${id}`);
            alert("Book deleted successfully!");
            fetchBooks();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete book.");
        }
    };

    return (
        <div className="container py-2">
            {/* 页头标题 */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-white mb-1">
                        <i className="fa-solid fa-boxes-stacked me-2" style={{ color: "#38bdf8" }}></i>
                        Inventory Management
                    </h2>
                    <p className="text-white-50 small mb-0">Manage library book listings, stocks, and shelf locations.</p>
                </div>
                <button className="btn btn-primary-gradient rounded-pill px-4 shadow-sm" type="button" data-bs-toggle="collapse" data-bs-target="#addBookCollapse">
                    <i className="fa-solid fa-plus me-1"></i> Add New Book
                </button>
            </div>

            {/* 新增图书折叠表单 */}
            <div className="collapse mb-4" id="addBookCollapse">
                <div className="card card-dark-glass card-body rounded-4 p-4">
                    <h5 className="fw-bold mb-3 text-info">
                        <i className="fa-solid fa-square-plus me-2"></i>Add New Book Entry
                    </h5>
                    <form onSubmit={handleAddSubmit} className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label small fw-medium text-white-50">Title</label>
                            <input type="text" name="title" className="form-control" value={formData.title} onChange={handleAddChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-medium text-white-50">Author</label>
                            <input type="text" name="author" className="form-control" value={formData.author} onChange={handleAddChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-medium text-white-50">ISBN</label>
                            <input type="text" name="isbn" className="form-control" value={formData.isbn} onChange={handleAddChange} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-medium text-white-50">Category</label>
                            <input type="text" name="category" className="form-control" value={formData.category} onChange={handleAddChange} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-medium text-white-50">Shelf Location</label>
                            <input type="text" name="shelfLocation" className="form-control" value={formData.shelfLocation} onChange={handleAddChange} required />
                        </div>
                        
                        {/* Total Stock (设为 readOnly，只能通过按钮加减) */}
                        <div className="col-md-3">
                            <label className="form-label small fw-medium text-white-50">Total Stock</label>
                            <div className="input-group">
                                <button type="button" className="btn btn-outline-light border-opacity-25 px-2" onClick={() => handleAddStep("totalStock", -1, false)}>-</button>
                                <input type="text" name="totalStock" className="form-control text-center bg-transparent text-white" value={formData.totalStock} readOnly />
                                <button type="button" className="btn btn-outline-light border-opacity-25 px-2" onClick={() => handleAddStep("totalStock", 1, false)}>+</button>
                            </div>
                        </div>

                        {/* Available Stock (设为 readOnly，只能通过按钮加减) */}
                        <div className="col-md-3">
                            <label className="form-label small fw-medium text-white-50">Available Stock</label>
                            <div className="input-group">
                                <button type="button" className="btn btn-outline-light border-opacity-25 px-2" onClick={() => handleAddStep("availableStock", -1, false)}>-</button>
                                <input type="text" name="availableStock" className="form-control text-center bg-transparent text-white" value={formData.availableStock} readOnly />
                                <button type="button" className="btn btn-outline-light border-opacity-25 px-2" onClick={() => handleAddStep("availableStock", 1, false)}>+</button>
                            </div>
                        </div>

                        <div className="col-12 text-end mt-3">
                            <button type="submit" className="btn btn-success rounded-pill px-4">
                                <i className="fa-solid fa-check me-1"></i> Save Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 库存表格卡片 */}
            <div className="card card-dark-glass rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-dark-glass align-middle mb-0">
                        <thead>
                            <tr>
                                <th className="ps-4">Title & Author</th>
                                <th>Category</th>
                                <th>ISBN</th>
                                <th>Shelf</th>
                                <th>Stock (Avail / Total)</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book._id}>
                                    <td className="ps-4">
                                        <div className="fw-bold text-white">{book.title}</div>
                                        <div className="text-white-50 small">{book.author}</div>
                                    </td>
                                    <td>
                                        <span className="badge bg-white bg-opacity-10 text-white border border-white border-opacity-10 px-2.5 py-1 rounded-pill">{book.category}</span>
                                    </td>
                                    <td className="text-white-50 small">{book.isbn}</td>
                                    <td>
                                        <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25">{book.shelfLocation}</span>
                                    </td>
                                    <td>
                                        <span className={`fw-bold ${book.availableStock > 0 ? "text-success" : "text-danger"}`}>{book.availableStock}</span>
                                        <span className="text-white-50"> / {book.totalStock}</span>
                                    </td>
                                    <td className="text-end pe-4">
                                        <button 
                                            onClick={() => handleOpenEditModal(book)} 
                                            className="btn btn-outline-info btn-sm rounded-circle p-2 me-2 border-opacity-25"
                                            style={{ width: '36px', height: '36px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                            title="Edit Book"
                                        >
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(book._id, book.title)} 
                                            className="btn btn-outline-danger btn-sm rounded-circle p-2 border-opacity-25"
                                            style={{ width: '36px', height: '36px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                            title="Delete Book"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {books.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-white-50">
                                        <i className="fa-solid fa-box-open fa-2x mb-2 d-block opacity-50"></i>
                                        No inventory books found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 编辑弹窗 (Edit Modal) */}
            {isEditModalOpen && editFormData && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(6px)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content card-dark-glass rounded-4 border-0 shadow-lg">
                            <div className="modal-header border-bottom border-white border-opacity-10 pb-3">
                                <h5 className="modal-title fw-bold text-white">
                                    <i className="fa-solid fa-pen-to-square text-info me-2"></i>
                                    Edit Book Details
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setIsEditModalOpen(false)}></button>
                            </div>
                            <form onSubmit={handleUpdateSubmit}>
                                <div className="modal-body py-4">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-medium text-white-50">Book Title</label>
                                            <input type="text" name="title" className="form-control" value={editFormData.title} onChange={handleEditChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-medium text-white-50">Author</label>
                                            <input type="text" name="author" className="form-control" value={editFormData.author} onChange={handleEditChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-medium text-white-50">ISBN</label>
                                            <input type="text" name="isbn" className="form-control" value={editFormData.isbn} onChange={handleEditChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-medium text-white-50">Category</label>
                                            <input type="text" name="category" className="form-control" value={editFormData.category} onChange={handleEditChange} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small fw-medium text-white-50">Shelf Location</label>
                                            <input type="text" name="shelfLocation" className="form-control" value={editFormData.shelfLocation} onChange={handleEditChange} required />
                                        </div>
                                        
                                        {/* Total Stock (设为 readOnly) */}
                                        <div className="col-md-4">
                                            <label className="form-label small fw-medium text-white-50">Total Stock</label>
                                            <div className="input-group">
                                                <button type="button" className="btn btn-outline-light border-opacity-25 px-2" onClick={() => handleAddStep("totalStock", -1, true)}>-</button>
                                                <input type="text" name="totalStock" className="form-control text-center bg-transparent text-white" value={editFormData.totalStock} readOnly />
                                                <button type="button" className="btn btn-outline-light border-opacity-25 px-2" onClick={() => handleAddStep("totalStock", 1, true)}>+</button>
                                            </div>
                                        </div>

                                        {/* Available Stock (设为 readOnly) */}
                                        <div className="col-md-4">
                                            <label className="form-label small fw-medium text-white-50">Available Stock</label>
                                            <div className="input-group">
                                                <button type="button" className="btn btn-outline-light border-opacity-25 px-2" onClick={() => handleAddStep("availableStock", -1, true)}>-</button>
                                                <input type="text" name="availableStock" className="form-control text-center bg-transparent text-white" value={editFormData.availableStock} readOnly />
                                                <button type="button" className="btn btn-outline-light border-opacity-25 px-2" onClick={() => handleAddStep("availableStock", 1, true)}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top border-white border-opacity-10 pt-3">
                                    <button type="button" className="btn btn-outline-light rounded-pill px-4 border-opacity-25" onClick={() => setIsEditModalOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary-gradient rounded-pill px-4">
                                        <i className="fa-solid fa-floppy-disk me-1"></i> Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInventory;