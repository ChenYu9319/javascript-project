import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', cardNo: '', role: 'member' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', formData);
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="row justify-content-center my-5">
            <div className="col-md-6">
                <div className="card card-dark-glass rounded-4 shadow-lg">
                    <div className="card-body p-4 p-md-5">
                        <div className="text-center mb-4">
                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-info mb-2" style={{ width: "56px", height: "56px" }}>
                                <i className="fa-solid fa-user-plus fs-4"></i>
                            </div>
                            <h3 className="card-title fw-bold text-white">Create Account</h3>
                            <p className="text-white-50 small">Join LibHub Central today</p>
                        </div>
                        {error && <div className="alert alert-danger bg-danger bg-opacity-25 text-white border-0">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-white-50 small fw-medium">Username</label>
                                <input type="text" className="form-control" required
                                    value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white-50 small fw-medium">Email Address</label>
                                <input type="email" className="form-control" required
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white-50 small fw-medium">Library Card No.</label>
                                <input type="text" className="form-control" required placeholder="e.g. CARD-1001"
                                    value={formData.cardNo} onChange={e => setFormData({ ...formData, cardNo: e.target.value })} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-white-50 small fw-medium">Password</label>
                                <input type="password" className="form-control" required
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary-gradient rounded-pill w-100 py-2.5 fw-medium">
                                Submit Registration
                            </button>
                        </form>
                        <p className="mt-4 text-center mb-0 text-white-50 small">
                            Already have an account? <Link to="/login" className="text-info fw-medium text-decoration-none">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;