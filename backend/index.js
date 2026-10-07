require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/AuthRoutes");
const booksRoutes = require("./routes/BooksRoutes");
const borrowLogsRoutes = require("./routes/BorrowLogsRoutes");
const reservationsRoutes = require("./routes/ReservationsRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CORS 配置 (允许预检请求和 Authorization 标头)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
}));

// 2. 解析 JSON 请求体
app.use(express.json());

// 3. 注册 API 路由
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/borrows", borrowLogsRoutes);
app.use("/api/reservations", reservationsRoutes);

// 4. 连接 MongoDB 数据库并启动服务
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB successfully!");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    });