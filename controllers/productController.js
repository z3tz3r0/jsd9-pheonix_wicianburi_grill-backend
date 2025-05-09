import mongoose from "mongoose";
import { Product } from "../models/Product";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.json({
      error: false,
      products,
      message: "All products retrieved successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Failed to fetch all products",
      detail: err.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById({ _id: productId });
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid product ID format",
      });
    }
    if (!product) {
      return res.status(404).json({
        error: true,
        message: "Product not found",
      });
    }

    return res.json({
      error: false,
      product,
      message: "Product retrieved successfully",
    });
  } catch (err) {
    consolr.error("Error fetching product", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

export const searchProducts = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(404).json({
      error: true,
      message: "Search query is required",
    });
  }

  try {
    const matchingProducts = await Product.find({
      $or: [
        { name: { $regex: new RegExp(query, "i") } },
        { type: { $regex: new RegExp(query, "i") } },
        { region: { $regex: new RegExp(query, "i") } },
      ],
    });
    return res.json({
      error: false,
      products: matchingProducts,
      message: "Products matching the search query retrieved successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};
