import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/Auth";

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="container py-3" style={{ background: "transparent" }}>
            {/* 1. 星空主题 Hero 英雄区 */}
            <div className="card card-dark-glass border-0 rounded-4 shadow-lg text-white overflow-hidden mb-5 p-4 p-md-5">
                <div className="row align-items-center">
                    <div className="col-lg-7">
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3 border border-white border-opacity-20" style={{ background: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(8px)" }}>
                            <i className="fa-solid fa-star text-warning small"></i>
                            <span className="small text-white-50 fw-medium">Next-Gen Library Platform</span>
                        </div>
                        <h1 className="display-5 fw-bold mb-3 lh-sm text-white">
                            Welcome to <span style={{ color: "#38bdf8", textShadow: "0 0 20px rgba(56, 189, 248, 0.5)" }}>LibHub Central</span>
                        </h1>
                        <p className="lead mb-4 fw-normal" style={{ fontSize: "1.05rem", color: "#cbd5e1" }}>
                            Seamlessly discover, borrow, and manage physical & digital resources in one unified space. Explore thousands of books with modern efficiency.
                        </p>
                        <div className="d-flex flex-wrap gap-3">
                            <Link to="/search" className="btn btn-primary-gradient btn-lg rounded-pill px-4 shadow-sm">
                                <i className="fa-solid fa-magnifying-glass me-2"></i> Explore Catalog
                            </Link>
                            {user ? (
                                user.role === "member" ? (
                                    <Link to="/profile" className="btn btn-outline-light btn-lg rounded-pill px-4 border-opacity-25">
                                        <i className="fa-solid fa-user-check me-2"></i> My Borrows
                                    </Link>
                                ) : (
                                    <Link to="/admin/dashboard" className="btn btn-outline-light btn-lg rounded-pill px-4 border-opacity-25">
                                        <i className="fa-solid fa-chart-line me-2"></i> Admin Dashboard
                                    </Link>
                                )
                            ) : (
                                <Link to="/register" className="btn btn-outline-light btn-lg rounded-pill px-4 border-opacity-25">
                                    <i className="fa-solid fa-user-plus me-2"></i> Join Now
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* 右侧星球 SVG 元素 */}
                    <div className="col-lg-5 d-none d-lg-flex justify-content-center align-items-center">
                        <div style={{ opacity: 0.85, filter: "drop-shadow(0 0 25px rgba(56, 189, 248, 0.3))" }}>
                            <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                                <path d="M2 12h20" strokeOpacity="0.4" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" strokeOpacity="0.4" />
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#a855f7" strokeWidth="1.8" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#a855f7" strokeWidth="1.8" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. 核心功能卡片网格 */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card h-100 card-dark-glass shadow-sm rounded-4 p-4 text-center card-hover">
                        <div className="bg-primary-subtle text-primary rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: "56px", height: "56px" }}>
                            <i className="fa-solid fa-book-open fs-4"></i>
                        </div>
                        <h5 className="fw-bold text-white mb-2">Vast Collection</h5>
                        <p className="text-white-50 small mb-0">Access a wide variety of genres, technical docs, fiction, and academic literature easily.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 card-dark-glass shadow-sm rounded-4 p-4 text-center card-hover">
                        <div className="bg-success-subtle text-success rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: "56px", height: "56px" }}>
                            <i className="fa-solid fa-bolt fs-4"></i>
                        </div>
                        <h5 className="fw-bold text-white mb-2">Instant Checkouts</h5>
                        <p className="text-white-50 small mb-0">Borrow and track your due dates with just one click using your personalized Library Card.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 card-dark-glass shadow-sm rounded-4 p-4 text-center card-hover">
                        <div className="bg-info-subtle text-info rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: "56px", height: "56px" }}>
                            <i className="fa-solid fa-shield-halved fs-4"></i>
                        </div>
                        <h5 className="fw-bold text-white mb-2">Smart Management</h5>
                        <p className="text-white-50 small mb-0">Role-based portal allowing smooth operations for both library patrons and administration.</p>
                    </div>
                </div>
            </div>

            {/* 3. 底部快捷入口 */}
            <div className="card card-dark-glass rounded-4 p-4 p-md-5 mb-4 shadow-sm card-hover">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h4 className="fw-bold text-white mb-1">{user ? `Ready to find your next read, ${user.username}?` : "New to LibHub Central?"}</h4>
                        <p className="text-white-50 small mb-md-0">{user ? "Browse through our full catalog or manage your current borrowed titles." : "Create an account to start borrowing books and managing your reading history today."}</p>
                    </div>
                    <div className="col-md-4 text-md-end">
                        {user ? (
                            <Link to="/search" className="btn btn-outline-light rounded-pill px-4 py-2">
                                <i className="fa-solid fa-book me-1"></i> Browse Books
                            </Link>
                        ) : (
                            <Link to="/login" className="btn btn-primary-gradient rounded-pill px-4 py-2">
                                <i className="fa-solid fa-right-to-bracket me-1"></i> Sign In Here
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;