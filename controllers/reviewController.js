import Review from "../models/Review.js";
//import Product from "../models/Product";
//import User from "../models/User.js";
import mongoose from "mongoose";
import errMessage from "../utils/errMessage.js";

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    return res.json({
      message: "สำเร็จ: เรียกดูรีวิวทั้งหมดเรียบร้อย",
      reviews,
    });
  } catch (error) {
    return next(errMessage(500, "เซิร์ฟเวอร์มีปัญหา"));
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (users must be logged in)

export const createReview = async (req, res) => {
  try {
    // Get data from the request body, using your schema field names
    const { productId, star, comment, firstName } = req.body;
    // Assuming authentication middleware puts user info on req.user
    const userId = req.user.user._id; // Get userId from authenticated user

    // Basic Server-Side Validation
    if (!productId || !userId || star === undefined || !comment || !firstName) {
      // Check for undefined star
      //res.status(400).json({ message: 'Please provide all required fields for the review (Product ID, User ID, Star Rating, Comment, First Name).' });
      return next(
        errMessage(
          400,
          "Please provide all required fields for the review (Product ID, User ID, Star Rating, Comment, First Name)."
        )
      );
    }
    // Validate star range based on your schema (min 0.5, max 5)
    const numericStar = Number(star); // Convert to number for validation
    if (isNaN(numericStar) || numericStar < 0.5 || numericStar > 5) {
      //res.status(400).json({ message: 'Star rating must be a number between 0.5 and 5.' });
      return next(
        errMessage(400, "Star rating must be a number between 0.5 and 5.")
      );
    }

    const newReview = new Review({
      productId,
      userId,
      star: numericStar, // Store the validated number
      comment,
      firstName, // Store the reviewer's first name
    });

    const createdReview = await newReview.save();

    // Optional: Update product rating/count on the Product model here

    res.status(201).json(createdReview); // Send the newly created review data back
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error: Could not create review." });
  }
};

// @desc    Get all reviews for a specific product
// @route   GET /api/reviews/:productId
// @access  Public

export const getReviewsForProduct = async (req, res) => {
  try {
    const productId = req.params.productId; // Get product ID from URL

    // Optional: Validate if the productId is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      //res.status(400).json({ message: 'Invalid Product ID format' });
      return next(errMessage(400, "Invalid Product ID format"));
    }

    // Find reviews for the product, sort by newest first
    // reviews found will include the 'star' field automatically
    const reviews = await Review.find({ productId })
      // .populate('userId', 'firstName') // Uncomment if you need user details from the User model
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(reviews); // Send the array of found reviews back
  } catch (error) {
    console.error(error);
    //res.status(500).json({ message: 'Server Error: Could not fetch reviews.' });
    return next(errMessage(500, "Server Error: Could not fetch reviews."));
  }
};
