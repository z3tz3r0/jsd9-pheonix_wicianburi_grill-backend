import { model, Schema } from "mongoose";

const ProductSchema = new Schema({
  name: { Type: String, required: true },
  type: { Type: String, required: true },
  variants: { Type: [Schema.Types.Mixed], required: true },
  description: { Type: String, required: true },
  image: { Type: String, required: true },
  region: { Type: String, required: true },
});

export const Product = model("Product", ProductSchema);
