import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

// Auth
// adminRoutes.post("/auth/register", createNewAdmin);
// adminRoutes.post("/auth/login", loginAdmin);
export const createNewAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, Email, or Password is missing" });
  }

  try {
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in used" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, email, password: hashPassword });
    await admin.save();
    return res
      .status(201)
      .json({ message: "SUCCESS: Create new admin", admin });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email or Password is missing" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credential" });
    }
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "invalid credential" });
    }
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/admin",
      maxAge: 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "SUCESS: Loging in",
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        password: admin.password,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
};

export const logoutAdmin = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/admin",
  });
  res.status(200).json({ message: "SUCESS: Logged out" });
};

export const getCurrentAdmin = async (req, res) => {
  if (!req.admin || !req.admin.adminId) {
    // This case should ideally be caught by the middleware sending 401/403
    return res.status(401).json({ message: "Not authorized or token invalid" });
  }
  try {
    const admin = await Admin.findById(req.admin.adminId).select("-password");
    if (!admin) {
      return res
        .status(404)
        .json({ message: "Admin associated with token not found" });
    }
    res.status(200).json({ message: "Admin verified", admin });
  } catch (error) {
    res.status(500).json({
      message: "Server error verifying admin",
      details: error.message,
    });
  }
};

// Manage Products
// adminRoutes.get("/products", getAllProducts);
// adminRoutes.get("/products/:id", getProductById);
// adminRoutes.post("/products", createNewProduct);
// adminRoutes.put("/products/:id", updateProductById);
// adminRoutes.delete("/products/:id", deleteProductById);
export const getAllProducts = async (_req, res) => {
  try {
    const products = await Product.find();
    return res.json({
      message: "SUCCESS: Retrieved all products",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "ERROR: Failed to fetch products",
      details: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "SUCCESS: Retrieved product", product });
  } catch (error) {
    return res.status(500).json({
      message: "ERROR: Failed to fetch product",
      details: error.message,
    });
  }
};

export const createNewProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    return res
      .status(201)
      .json({ message: "SUCCESS: New Product created", data: savedProduct });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation Error", details: error.message });
    }
    return res.status(500).json({
      message: "ERROR: Failed to create product",
      details: error.message,
    });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({
      message: "SUCCESS: Product updated",
      data: updatedProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation Error", details: error.message });
    }
    return res.status(500).json({
      message: "ERROR: Failed to update product",
      details: error.message,
    });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Use 200 with message or 204 (No Content)
    return res
      .status(200)
      .json({ message: "SUCCESS: Product deleted", data: { _id: id } });
    // return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: "ERROR: Failed to delete product",
      details: error.message,
    });
  }
};

// Manage Orders
// adminRoutes.get("/orders", getAllOrders);
// adminRoutes.get("/orders/:id", getOrderById);
// adminRoutes.put("/orders/:id", updateOrder);
export const getAllOrders = async (_req, res) => {
  try {
    // Consider populating user details if needed: .populate('user', 'name email')
    const orders = await Order.find().sort({ createdAt: -1 }); // Sort by newest first
    return res.json({ message: "SUCCESS: Retrieved all orders", data: orders });
  } catch (error) {
    return res.status(500).json({
      message: "ERROR: Failed to fetch orders",
      details: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }
    // Consider populating user/product details: .populate('user').populate('items.product')
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json({ message: "SUCCESS: Retrieved order", data: order });
  } catch (error) {
    return res.status(500).json({
      message: "ERROR: Failed to fetch order",
      details: error.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  // Typically only update specific fields like status, tracking info, etc.
  // Avoid allowing updates to items, total price, user directly via this endpoint.
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    // Example: Only allow updating 'status' and 'trackingNumber'
    const allowedUpdates = {
      status: req.body.status,
      trackingNumber: req.body.trackingNumber,
    };
    // Remove undefined fields so they don't overwrite existing data
    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const updatedOrder = await Order.findByIdAndUpdate(id, allowedUpdates, {
      new: true,
      runValidators: true,
    });
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json({ message: "SUCCESS: Order updated", data: updatedOrder });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation Error", details: error.message });
    }
    return res.status(500).json({
      message: "ERROR: Failed to update order",
      details: error.message,
    });
  }
};

// Manage users
// adminRoutes.get("/users", getAllUsers);
// adminRoutes.post("/users", createNewUser);
// adminRoutes.put("/users/:id", updateUserById);
// adminRoutes.delete("/users/:id", deleteUserById);
export const getAllUsers = async (_req, res) => {
  try {
    // Exclude password field from the result
    const users = await User.find().select("-password");
    return res.json({ message: "SUCCESS: Retrieved all users", data: users });
  } catch (error) {
    return res.status(500).json({
      message: "ERROR: Failed to fetch users",
      details: error.message,
    });
  }
};

export const createNewUser = async (req, res) => {
  // Note: This allows admins to create users. Ensure this is intended.
  // Usually registration is handled separately.
  try {
    const { name, email, password, fullName } = req.body; // Adjust fields as per your User model
    // Basic validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" }); // 409 Conflict
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      fullName, // Add other fields as needed
    });
    const savedUser = await newUser.save();

    // Don't send password back
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    return res
      .status(201)
      .json({ message: "SUCCESS: User created", data: userResponse });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation Error", details: error.message });
    }
    return res.status(500).json({
      message: "ERROR: Failed to create user",
      details: error.message,
    });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Prevent password update through this route for security
    const { password, ...updateData } = req.body;
    if (password) {
      return res
        .status(400)
        .json({ message: "Password cannot be updated via this route." });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password"); // Exclude password from the returned object

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "SUCCESS: User updated", data: updatedUser });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation Error", details: error.message });
    }
    return res.status(500).json({
      message: "ERROR: Failed to update user",
      details: error.message,
    });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "SUCCESS: User deleted", data: { _id: id } });
    // return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: "ERROR: Failed to delete user",
      details: error.message,
    });
  }
};
