import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 编辑模态框相关 State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState(null);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const res = await API.get('/auth/users'); // 获取所有用户接口
            if (Array.isArray(res.data)) {
                // 仅筛选出 role 为 member 的用户
                const memberList = res.data.filter(u => u.role === 'member');
                setUsers(memberList);
            }
        } catch (err) {
            console.error('Failed to fetch members:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    // 关键词搜索过滤逻辑（支持匹配用户名、邮箱、卡号）
    const filteredUsers = users.filter(user => {
        const term = searchTerm.toLowerCase();
        return (
            (user.username && user.username.toLowerCase().includes(term)) ||
            (user.email && user.email.toLowerCase().includes(term)) ||
            (user.cardNo && user.cardNo.toLowerCase().includes(term))
        );
    });

    // 当搜索词改变时，重置回第一页
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // 打开编辑模态框
    const handleOpenEditModal = (member) => {
        setEditFormData({ ...member });
        setIsEditModalOpen(true);
    };

    // 处理编辑表单输入变化
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    // 提交更新用户
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/auth/users/${editFormData._id}`, editFormData);
            alert('Member updated successfully!');
            setIsEditModalOpen(false);
            setEditFormData(null);
            fetchMembers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update member.');
        }
    };

    // 删除用户
    const handleDelete = async (id, username) => {
        if (!window.confirm(`Are you sure you want to delete member "${username}"?`)) return;
        try {
            await API.delete(`/auth/users/${id}`);
            alert('Member deleted successfully!');
            fetchMembers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete member.');
        }
    };

    // 分页计算
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-info" role="status"></div>
                <p className="mt-2 text-white-50">Loading member records...</p>
            </div>
        );
    }

    return (
        <div className="container py-2">
            {/* 页头 */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-white mb-1">
                        <i className="fa-solid fa-users me-2" style={{ color: "#38bdf8" }}></i>
                        Member Directory
                    </h2>
                    <p className="text-white-50 small mb-0">View and manage all registered library members.</p>
                </div>
                <span className="badge bg-white bg-opacity-10 text-white border border-white border-opacity-10 px-3 py-2">
                    <i className="fa-solid fa-user-group me-1 text-info"></i> Total Members: {filteredUsers.length} {searchTerm && `(Filtered from ${users.length})`}
                </span>
            </div>

            {/* 纯 Search 搜索栏 */}
            <div className="card card-dark-glass rounded-4 p-3 mb-4">
                <div className="row g-3 align-items-center">
                    <div className="col-md-12">
                        <div className="input-group">
                            <span className="input-group-text border-end-0 text-white-50 rounded-start-pill ps-3" style={{ background: "rgba(15, 23, 42, 0.4)", borderColor: "rgba(255, 255, 255, 0.15)" }}>
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </span>
                            <input 
                                type="text" 
                                className="form-control border-start-0 rounded-end-pill ps-2 text-white bg-transparent" 
                                placeholder="Search by username, email or library card..."
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                            />
                            {searchTerm && (
                                <button 
                                    type="button" 
                                    onClick={() => setSearchTerm('')} 
                                    className="btn btn-outline-light border-start-0 border-opacity-25 rounded-pill ms-2 text-white-50 px-3"
                                    style={{ fontSize: '0.85rem' }}
                                >
                                    <i className="fa-solid fa-rotate-left me-1"></i> Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 用户列表表格 */}
            <div className="card card-dark-glass rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-dark-glass align-middle mb-0">
                        <thead>
                            <tr>
                                <th className="ps-4">Username</th>
                                <th>Email Address</th>
                                <th>Library Card No.</th>
                                <th>Role Status</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map(member => (
                                <tr key={member._id}>
                                    <td className="ps-4 fw-medium text-white">
                                        <i className="fa-solid fa-user-circle text-info me-2 fs-5 align-middle"></i>
                                        {member.username}
                                    </td>
                                    <td className="text-white-50">
                                        <a href={`mailto:${member.email}`} className="text-white-50 text-decoration-none">
                                            {member.email}
                                        </a>
                                    </td>
                                    <td>
                                        <span className="badge bg-white bg-opacity-10 text-white border border-white border-opacity-10 px-2.5 py-1 rounded-pill">
                                            {member.cardNo || 'N/A'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-25 rounded-pill px-3 py-1">
                                            Member
                                        </span>
                                    </td>
                                    <td className="text-end pe-4">
                                        <button 
                                            onClick={() => handleOpenEditModal(member)} 
                                            className="btn btn-outline-info btn-sm rounded-circle p-2 me-2 border-opacity-25"
                                            style={{ width: '36px', height: '36px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                            title="Edit Member"
                                        >
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(member._id, member.username)} 
                                            className="btn btn-outline-danger btn-sm rounded-circle p-2 border-opacity-25"
                                            style={{ width: '36px', height: '36px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                            title="Delete Member"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-white-50">
                                        <i className="fa-solid fa-user-slash fa-2x mb-2 d-block opacity-50"></i>
                                        No registered members found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 分页控制条 */}
                {totalPages > 1 && (
                    <div className="card-footer bg-transparent border-top border-white border-opacity-10 py-3 px-4 d-flex justify-content-between align-items-center">
                        <span className="text-white-50 small">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="btn-group">
                            <button 
                                className="btn btn-outline-light btn-sm px-3 border-opacity-25 rounded-start-pill"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            >
                                <i className="fa-solid fa-chevron-left me-1"></i> Prev
                            </button>
                            <button 
                                className="btn btn-outline-light btn-sm px-3 border-opacity-25 rounded-end-pill"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            >
                                Next <i className="fa-solid fa-chevron-right ms-1"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 编辑会员弹窗 (Edit Modal) */}
            {isEditModalOpen && editFormData && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(6px)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content card-dark-glass rounded-4 border-0 shadow-lg">
                            <div className="modal-header border-bottom border-white border-opacity-10 pb-3">
                                <h5 className="modal-title fw-bold text-white">
                                    <i className="fa-solid fa-pen-to-square text-info me-2"></i>
                                    Edit Member Details
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setIsEditModalOpen(false)}></button>
                            </div>
                            <form onSubmit={handleUpdateSubmit}>
                                <div className="modal-body py-4">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-medium text-white-50">Username</label>
                                            <input type="text" name="username" className="form-control" value={editFormData.username} onChange={handleEditChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-medium text-white-50">Email Address</label>
                                            <input type="email" name="email" className="form-control" value={editFormData.email} onChange={handleEditChange} required />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label small fw-medium text-white-50">Library Card No.</label>
                                            <input type="text" name="cardNo" className="form-control" value={editFormData.cardNo || ''} onChange={handleEditChange} />
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

export default AdminUsers;