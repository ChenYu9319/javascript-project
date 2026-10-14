const express = require("express");
const BooksController = require("../controllers/BooksController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const route = express.Router();

// public rotes ( not need login )
route.get("/", BooksController.getAllBooks);
route.get("/categories", BooksController.getUniqueCategories);
route.get("/:id", BooksController.getBookById);

// 只有管理员可以add, delete, edit books
route.post("/", verifyToken, isAdmin, BooksController.addNewBook);
route.put("/:id", verifyToken, isAdmin, BooksController.updateBookById);
route.delete("/:id", verifyToken, isAdmin, BooksController.deleteBookById);

module.exports = route;