import { Router } from "express";
import {
  createNewOrder,
  getAllOrders,
  updatePaymentSlip,
} from "../controllers/orderController.js";

const router = Router();

router.get("/orders", getAllOrders);
router.post("/orders", createNewOrder);

// update Payment Slip;
router.put("/:orderId", updatePaymentSlip);

export default router;
