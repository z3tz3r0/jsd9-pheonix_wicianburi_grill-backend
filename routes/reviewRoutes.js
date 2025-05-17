import { Router } from "express";
import {
  createReview,
  getAllReviews,
  getReviewsForProduct,
} from "../controllers/reviewController.js";
import { authUser } from "../middlewares/auth.js";

const reviewRouters = Router();

reviewRouters.get("/", getAllReviews);
reviewRouters.get("/:productId", getReviewsForProduct);
reviewRouters.post("/", authUser, createReview);

export default reviewRouters;
