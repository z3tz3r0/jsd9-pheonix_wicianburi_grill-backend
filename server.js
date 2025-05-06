import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";


dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend origin
    credentials: true,
  })
); // อย่าลืมมาแก้ cors ตอน deploy
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", userRoutes);

// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/reviews", reviewRoutes);

// TODO : Kob working on this
// TODO : required other models to be done to see what schema look like.
import adminRoutes from "./routes/adminRoutes.js";
app.use("/admin", adminRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`🍺 MongoDB is chilled and on tap! Now let's serve some fresh code on port ${5000} — cheers! 🍻`);
  } catch (err) {
    console.error(`💥🍻 Oops! MongoDB just spilled the beer. Error: ${err.message}`);
    process.exit(1);
  }
};

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🍺 Server is brewing at http://localhost:${PORT} — cheers to code & cold beers!`);
});

