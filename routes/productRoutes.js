import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  searchProducts,
} from "../controllers/productController.js";

const productRoutes = Router();

productRoutes.get("/", getAllProducts);

productRoutes.get("/:id", getProductById);

productRoutes.get("/search-products", searchProducts);

export default productRoutes;
