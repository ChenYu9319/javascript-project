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
        <div className="row justify-content-center mt-5">
            <div className="col-md-6">
                <div className="card shadow border-0">
                    <div className="card-body p-4">
                        <h3 className="card-title text-center mb-4">Create Account</h3>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input type="text" className="form-control" required
                                    value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-control" required
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Library Card No.</label>
                                <input type="text" className="form-control" required placeholder="e.g. CARD-1001"
                                    value={formData.cardNo} onChange={e => setFormData({ ...formData, cardNo: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" required
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-success w-100">Submit Registration</button>
                        </form>
                        <p className="mt-3 text-center mb-0">Already have an account? <Link to="/login">Sign in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;