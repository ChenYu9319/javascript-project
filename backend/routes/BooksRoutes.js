const express = require("express");
const BooksController = require("../controllers/BooksController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const route = express.Router();

// 公开接口 (无需登录)
route.get("/", BooksController.getAllBooks);
route.get("/categories", BooksController.getUniqueCategories); // 修正为复数 /categories
route.get("/:id", BooksController.getBookById);

// 只有管理员可以增删改图书 (受保护接口)
route.post("/", verifyToken, isAdmin, BooksController.addNewBook);
route.put("/:id", verifyToken, isAdmin, BooksController.updateBookById);
route.delete("/:id", verifyToken, isAdmin, BooksController.deleteBookById);

module.exports = route;