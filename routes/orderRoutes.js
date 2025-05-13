import { Router } from "express";
import {
  createNewOrder,
  getOrderById,
  getUserOrders,
  updatePaymentSlip,
} from "../controllers/orderController.js";
import { authUser } from "../middlewares/auth.js";

const router = Router();

router.post("/", authUser, createNewOrder);
router.get("/", authUser, getUserOrders);
router.get("/:id", authUser, getOrderById);

// update Payment Slip;
router.put("/:orderId", updatePaymentSlip);

export default router;
