import { model, Schema } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  variants: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  description: { type: String, required: true },
  image: { type: String, required: true },
  region: { type: String, required: true },
});

export const Product = model("Product", ProductSchema);
