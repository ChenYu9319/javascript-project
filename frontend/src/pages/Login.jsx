import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../auth/Auth';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', formData);
            login(res.data.user, res.data.token);

            if (res.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/search');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-5">
                <div className="card shadow border-0">
                    <div className="card-body p-4">
                        <h3 className="card-title text-center mb-4">User Login</h3>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-control" required
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" required
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </form>
                        <p className="mt-3 text-center mb-0">Don't have an account? <Link to="/register">Register here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;