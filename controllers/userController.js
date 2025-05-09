import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const { email, firstname, lastname, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "บัญชีนี้มีผู้ใช้งานแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      firstname,
      lastname,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "สร้างผู้ใช้งานใหม่สำเร็จ" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "อีเมลไม่ถูกต้อง" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "รหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    
    const isProd = process.env.NODE_ENV === "production";

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "เข้าสู่ระบบสำเร็จ",
        user: {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

export const logoutUser = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  console.log("Logged out!")
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({ message: "ออกจากระบบแล้ว" });
};


// Get All Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ error: false, users });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "ดึงข้อมูลจาก users ไม่สำเร็จ",
      details: err.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: true, message: "ไม่พบผู้ใช้" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "ดึงข้อมูลผู้ใช้ล้มเหลว",
      details: err.message,
    });
  }
};
