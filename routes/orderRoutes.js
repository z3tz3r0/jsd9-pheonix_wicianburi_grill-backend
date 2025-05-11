import { Router } from "express";
import { getAllOrders, createNewOrder } from "../controllers/orderController.js";

const router = Router();

router.get("/", getAllOrders);
// router.get("/:id", getOrderById);
router.post("/", createNewOrder);
// router.put("/:id", updatePayment);

export default router;