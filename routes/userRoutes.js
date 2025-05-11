import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateCurrentUser,
} from "../controllers/userController.js";
import { authUser } from "../middlewares/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/users/me", authUser, getCurrentUser);
router.put("/users/update", authUser, updateCurrentUser);

export default router;
