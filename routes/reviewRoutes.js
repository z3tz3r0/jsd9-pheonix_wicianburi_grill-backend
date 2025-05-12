import { Router } from "express";
import { getReviewsForProduct, createReview } from "../controllers/reviewController.js";
import { authUser } from "../middlewares/auth.js";

const reviewRouters = Router();

reviewRouters.post("/",authUser, createReview);
reviewRouters.get("/:productId", getReviewsForProduct);

export default reviewRouters;