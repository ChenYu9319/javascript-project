const express = require("express");
const BorrowLogsController = require("../controllers/BorrowLogsController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const route = express.Router();

route.post("/", verifyToken, BorrowLogsController.createNewBorrow);

// retrieve borrowing and return records. ( only login but admin cannot borrowing books )
route.get("/", verifyToken, BorrowLogsController.getAllBorrowLogs);
route.put("/:id/return", verifyToken, BorrowLogsController.returnBook);

// delete record ( 要用 Admin )
route.delete("/:id", verifyToken, isAdmin, BorrowLogsController.deleteBorrowLogById);

module.exports = route;