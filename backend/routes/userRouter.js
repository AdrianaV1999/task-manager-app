import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getCurrentUser,
  updateProfile,
  registerUser,
  loginUser,
  updatePassword,
} from "../controllers/userController.js";

const userRouter = express.Router();

// PUBLIC ROUTES

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// PRIVATE ROUTES

userRouter.get("/me", authMiddleware, getCurrentUser);
userRouter.put("/profile", authMiddleware, updateProfile);
userRouter.put("/password", authMiddleware, updatePassword);

export default userRouter;
