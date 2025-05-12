import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  getSimilarProducts,
} from "../controllers/productController.js";

const productRoutes = Router();

productRoutes.get("/", getAllProducts);

productRoutes.get("/similar", getSimilarProducts);

productRoutes.get("/:id", getProductById);

export default productRoutes;
