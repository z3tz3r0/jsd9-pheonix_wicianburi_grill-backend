import { model, Schema } from "mongoose";

const ProductSchema = new Schema({
  productName: { Type: String, required: true },
  productType: { Type: String, require: true },
  variants: { Type: [String, Number], require: true },
  description: { Type: String, require: true },
  image: { Type: String, require: true },
  region: { Type: String, require: true },
});

export const Product = model("Product", ProductSchema);
