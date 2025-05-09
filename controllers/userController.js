import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import errMessage from "../utils/errMessage.js";

export const registerUser = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "บัญชีนี้มีผู้ใช้งานแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "สร้างผู้ใช้งานใหม่สำเร็จ" });
  } catch (error) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดระหว่างสร้างผู้ใช้งานใหม่" });
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
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
  } catch (error) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ" });
  }
};

export const logoutUser = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  console.log("Logged out!");
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

export const updateCurrentUser = async (req, res, next) => {
  const { firstName, lastName, email, phone, address } = req.body;
  const userId = req.user.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(errMessage(404, "ไม่พบผู้ใช้"));
    }

    // Update fields if provided in the request body
    if (firstName !== undefined) {
      if (!firstName.trim()) {
        return next(errMessage(400, "ชื่อจริงห้ามเป็นค่าว่าง"));
      }
      user.firstName = firstName;
    }
    if (lastName !== undefined) {
      if (!lastName.trim()) {
        return next(errMessage(400, "นามสกุลห้ามเป็นค่าว่าง"));
      }
      user.lastName = lastName;
    }
    if (email !== undefined) {
      if (!email.trim()) {
        return next(errMessage(400, "อีเมลห้ามเป็นค่าว่าง"));
      }
      // Check if email already exists for another user, excluding the current user
      if (email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return next(errMessage(400, "อีเมลนี้มีผู้ใช้งานอื่นแล้ว"));
        }
      }
      user.email = email;
    }
    if (phone !== undefined) {
      user.phone = phone;
    }
    if (address !== undefined) {
      // Update nested address fields if provided
      if (address.street !== undefined) {
        user.address.street = address.street;
      }
      if (address.subDistrict !== undefined) {
        user.address.subDistrict = address.subDistrict;
      }
      if (address.district !== undefined) {
        user.address.district = address.district;
      }
      if (address.province !== undefined) {
        user.address.province = address.province;
      }
      if (address.postal !== undefined) {
        user.address.postal = address.postal;
      }
    }

    await user.save();

    res.json({
      message: "อัปเดตข้อมูลผู้ใช้สำเร็จ",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (err) {
    next(errMessage(500, "เกิดข้อผิดพลาดระหว่างอัปเดตข้อมูลผู้ใช้"));
  }
};
