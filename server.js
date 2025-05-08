import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./middlewares/errorHandler.js";
import limiter from "./middlewares/rateLimiter.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const whitelist = [
  "http://localhost:5173",
  "https://jsd9-pheonix-wicianburi-grill-backend.onrender.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Middleware
app.use(cors(corsOptions));
app.use(limiter);

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

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
    console.log(
      `🍺 MongoDB is chilled and on tap! Now let's serve some fresh code on port ${5000} — cheers! 🍻`
    );
  } catch (err) {
    console.error(
      `💥🍻 Oops! MongoDB just spilled the beer. Error: ${err.message}`
    );
    process.exit(1);
  }
};

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(
    `🍺 Server is brewing at http://localhost:${PORT} — cheers to code & cold beers!`
  );
});
