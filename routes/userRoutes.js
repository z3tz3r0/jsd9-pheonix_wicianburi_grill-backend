import { Router } from "express";
import { registerUser, loginUser, logoutUser, getUsers, getCurrentUser } from "../controllers/userController.js";
import { authUser } from "../middlewares/auth.js";


const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/users", getUsers); // สำหรับ Admin 
router.get("/users/me", authUser, getCurrentUser); //เข้าถึงได้เฉพาะคนที่ login แล้ว

export default router;
