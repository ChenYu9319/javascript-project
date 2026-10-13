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
        <div className="row justify-content-center my-5">
            <div className="col-md-5">
                <div className="card card-dark-glass rounded-4 shadow-lg">
                    <div className="card-body p-4 p-md-5">
                        <div className="text-center mb-4">
                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-info mb-2" style={{ width: "56px", height: "56px" }}>
                                <i className="fa-solid fa-right-to-bracket fs-4"></i>
                            </div>
                            <h3 className="card-title fw-bold text-white">User Login</h3>
                            <p className="text-white-50 small">Access your library account</p>
                        </div>
                        {error && <div className="alert alert-danger bg-danger bg-opacity-25 text-white border-0">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-white-50 small fw-medium">Email Address</label>
                                <input type="email" className="form-control" required
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-white-50 small fw-medium">Password</label>
                                <input type="password" className="form-control" required
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary-gradient rounded-pill w-100 py-2.5 fw-medium">
                                Sign In
                            </button>
                        </form>
                        <p className="mt-4 text-center mb-0 text-white-50 small">
                            Don't have an account? <Link to="/register" className="text-info fw-medium text-decoration-none">Register here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;