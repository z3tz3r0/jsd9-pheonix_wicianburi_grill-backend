import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import Review from "../models/Review.js";

export const getAllProducts = async (req, res) => {
  try {
    // const products = await Product.find();
    const products = await Product.aggregate([
      {
        $lookup: {
          from: Review.collection.name, // Get the correct collection name for reviews
          localField: "_id", // Field from the products collection
          foreignField: "productId", // Field from the reviews collection that links to product._id
          as: "reviewsData", // Name of the new array field to add
        },
      },
      {
        $addFields: {
          averageStar: {
            $ifNull: [{ $avg: "$reviewsData.star" }, 0], // Calculate average, default to 0 if no reviews or star field is null
          },
          reviewCount: {
            $size: "$reviewsData", // Count the number of reviews
          },
          typeSortOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$type", "ข้าวหอมมะลิ"] }, then: 1 },
                { case: { $eq: ["$type", "ข้าวเหนียว"] }, then: 2 },
                { case: { $eq: ["$type", "ข้าวขาว"] }, then: 3 },
                { case: { $eq: ["$type", "ข้าวเพื่อสุขภาพ"] }, then: 4 },
                { case: { $eq: ["$type", "สินค้าแปรรูป"] }, then: 99 }, // Ensure this comes last
              ],
              default: 5, // Other types
            },
          },
        },
      },
      {
        $project: {
          reviewsData: 0, // Remove the array of all reviews from the final product object to keep response lean
        },
      },
      { $sort: { typeSortOrder: 1, averageStar: -1, name: 1 } }, // Optional: sort products, e.g., by creation date
    ]);

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
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: true,
        message: "Invalid product ID format",
      });
    }
    const product = await Product.findById(id);
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
    console.error("Error fetching product", err);
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

export const getSimilarProducts = async (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({
      error: true,
      message: "Product type query parameter is required",
    });
  }

  try {
    const matchingProducts = await Product.find({
      type: { $regex: new RegExp(type, "i") },
    });
    return res.json({
      error: false,
      products: matchingProducts,
      message: `Products of type '${type}' retrieved successfully`,
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};
