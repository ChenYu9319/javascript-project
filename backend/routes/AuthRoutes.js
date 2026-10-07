const express = require("express");
const AuthController = require("../controllers/AuthController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const route = express.Router();

// 公开接口
route.post("/register", AuthController.register);
route.post("/login", AuthController.login);

// 受保护的用户管理接口
route.get("/users", verifyToken, isAdmin, AuthController.getAllUsers);
route.get("/users/:id", verifyToken, AuthController.getUserById);
route.put("/users/:id", verifyToken, AuthController.updateUserById);
route.delete("/users/:id", verifyToken, isAdmin, AuthController.deleteUserById);

module.exports = route;