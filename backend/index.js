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

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/borrows", borrowLogsRoutes);
app.use("/api/reservations", reservationsRoutes);

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