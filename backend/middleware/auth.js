const jwt = require("jsonwebtoken");

// 1. 验证用户是否已登录 (JWT Token 校验)
exports.verifyToken = (req, res, next) => {
    // 从 Request Header 中获取 token (格式: "Bearer <TOKEN>")
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access token is missing or unauthorized." });
    }

    try {
        // 使用 .env 中的 JWT_SECRET_KEY 解析 token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // 将解析出的用户信息挂载到 req 对象上
        next(); // 验证通过，放行到下一个控制器
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

// 2. 验证是不是 admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next(); // 是 admin 就能进去
    } else {
        return res.status(403).json({ message: "Insufficient permissions, restricted to administrators." });
    }
};