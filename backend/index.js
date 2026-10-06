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

// Middleware
app.use(express.json());

const corsHandler = cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
});

app.use(corsHandler);

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB successfully!");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
    });

// Routes 注册四大模块
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/borrows", borrowLogsRoutes);
app.use("/api/reservations", reservationsRoutes);