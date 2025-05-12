import { Schema } from "mongoose";
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    star: {
        type: Number,
        required: true,
        min: 0.5,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
    },
},
{
    timestamps: true,
},
);

const Review =mongoose.model('Review', ReviewSchema);
export default Review;