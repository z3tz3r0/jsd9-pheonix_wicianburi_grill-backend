import { Router } from "express";
import { getUserOrders, createNewOrder, getOrderById } from "../controllers/orderController.js";
import { authUser } from "../middlewares/auth.js";

const router = Router();

router.post("/", authUser, createNewOrder);
router.get("/", authUser, getUserOrders);
router.get("/:id", authUser, getOrderById);
//router.put("/:id", authUser, updatePayment);

export default router;