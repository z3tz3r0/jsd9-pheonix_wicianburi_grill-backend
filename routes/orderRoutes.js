import { Router } from "express";
import { getAllOrders, createNewOrder } from "../controllers/orderController.js";

const router = Router();

router.get("/orders", getAllOrders);
router.post("/orders", createNewOrder);

export default router;