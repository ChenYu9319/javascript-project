const express = require("express");
const AuthController = require("../controllers/AuthController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const route = express.Router();

// login and register rotes
route.post("/register", AuthController.register);
route.post("/login", AuthController.login);

// 受保护的用户管理接口
route.get("/users", verifyToken, isAdmin, AuthController.getAllUsers);
route.get("/users/:id", verifyToken, AuthController.getUserById);
route.put("/users/:id", verifyToken, AuthController.updateUserById);
route.delete("/users/:id", verifyToken, isAdmin, AuthController.deleteUserById); // 这个是在postman里的，当我是admin是，我能delete user 除了我自己

module.exports = route;