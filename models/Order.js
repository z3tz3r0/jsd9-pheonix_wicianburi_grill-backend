import { Schema, model } from "mongoose";

const OrderSchema = new Schema(
    {
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",                              // อ้างอิงไปยัง Model ชื่อ "User"
        required: true,
    },
    stateVariant: {
        type: String,
        enum: ["รอยืนยัน", "กำลังจัดส่ง", "จัดส่งสำเร็จ"],
        default: "รอยืนยัน",
    },
    paymentSlipLink: {
        type: String,
    },
    totalAmount: {
        type: Number,
    },
    deliveryFee: {
        type: Number,
    },
    orderItems: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
          },
          variantValue: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
          },
        }
    ]
    },
    { timestamps: true }
);

export const Order = model("Order", OrderSchema);
