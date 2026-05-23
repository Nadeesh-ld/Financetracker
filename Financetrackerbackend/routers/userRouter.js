import express from "express";
import {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getUsersByRole,
  verifyUserPin,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const userRouter = express.Router();

// POST - Register a new user
userRouter.post("/register", registerUser);

// POST - Login user
userRouter.post("/login", loginUser);

// GET - Get all users
userRouter.get("/", getUsers);

// GET - Get users by role
userRouter.get("/role/:role", getUsersByRole);

// POST - Verify app PIN for unlock
userRouter.post("/:id/verify-pin", auth, verifyUserPin);

// GET - Get user by ID
userRouter.get("/:id", getUserById);

// PUT - Update user by ID
userRouter.put("/:id", updateUser);

// DELETE - Delete user by ID
userRouter.delete("/:id", deleteUser);

export default userRouter;
