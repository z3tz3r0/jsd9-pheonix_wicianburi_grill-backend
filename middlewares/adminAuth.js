import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(409).json({ message: "ACCESS DENIED: no token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { adminId: decoded.adminId };
    next();
  } catch (error) {
    const isExpired = error.name === "TokenExpiredError";
    res.status(401).json({
      message: isExpired
        ? "Token has expired, please log in again"
        : "Invalid Token",
    });
  }
};

export default authAdmin;
