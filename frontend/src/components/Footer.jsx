import React from 'react';

const Footer = () => {
    return (
        <footer 
            className="text-white py-4 mt-auto"
            style={{ 
                backgroundColor: '#060911',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
        >
            <div className="container">
                <div className="row align-items-center g-3">
                    {/* 左侧说明与品牌 */}
                    <div className="col-md-6 text-center text-md-start">
                        <span className="fw-bold text-white fs-5">
                            <i className="fa-solid fa-book-open text-info me-2"></i>LibHub Central
                        </span>
                        <p className="small mb-0 text-white-50 mt-1">
                            Next-Gen Library Management System.
                        </p>
                    </div>

                    {/* 右侧联系方式与社媒链接 */}
                    <div className="col-md-6 text-center text-md-end">
                        <div className="d-flex flex-wrap justify-content-center justify-content-md-end align-items-center gap-3">
                            {/* Email 链接 */}
                            <a 
                                href="mailto:admin@libhub.com" 
                                className="text-white-50 text-decoration-none small d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill"
                                style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                            >
                                <i className="fa-solid fa-envelope text-info"></i>
                                <span>admin@libhub.com</span>
                            </a>

                            {/* Social Icons (FB & IG) */}
                            <div className="d-flex gap-2">
                                <a 
                                    href="https://facebook.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn btn-outline-light btn-sm rounded-circle border-opacity-25 d-flex align-items-center justify-content-center"
                                    style={{ width: '36px', height: '36px' }}
                                    title="Facebook"
                                >
                                    <i className="fa-brands fa-facebook text-info"></i>
                                </a>
                                <a 
                                    href="https://instagram.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn btn-outline-light btn-sm rounded-circle border-opacity-25 d-flex align-items-center justify-content-center"
                                    style={{ width: '36px', height: '36px' }}
                                    title="Instagram"
                                >
                                    <i className="fa-brands fa-instagram text-info"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 底部版权声明 */}
                <div className="text-center mt-3 pt-3 border-top border-white border-opacity-10 small text-white-50">
                    © {new Date().getFullYear()} LibHub Central Management System. All Rights Reserved.[cite: 14]
                </div>
            </div>
        </footer>
    );
};

export default Footer;