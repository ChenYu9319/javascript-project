const express = require("express");
const BorrowLogsController = require("../controllers/BorrowLogsController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const route = express.Router();

// 借书接口 (只需登录)
route.post("/", verifyToken, BorrowLogsController.createNewBorrow);

// 获取借阅记录 & 还书 (只需登录)
route.get("/", verifyToken, BorrowLogsController.getAllBorrowLogs);
route.put("/:id/return", verifyToken, BorrowLogsController.returnBook);

// 删除记录 (需要 Admin 权限)
route.delete("/:id", verifyToken, isAdmin, BorrowLogsController.deleteBorrowLogById);

module.exports = route;