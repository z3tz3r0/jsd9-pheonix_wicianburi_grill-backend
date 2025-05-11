import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  searchProducts,
} from "../controllers/productController";

const productRouters = Router();

productRouters.get("/products", getAllProducts);

productRouters.get("/products/:id", getProductById);

productRouters.get("/search-products", searchProducts);
