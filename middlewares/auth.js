import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  const token =
    req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({
      error: true,
      code: "NO_TOKEN",
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { user: { _id: decoded_token.userId } };
    next();
  } catch (err) {
    const isExpired = err.name === "TokenExpiredError";
    return res.status(401).json({
      error: true,
      code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
      message: isExpired
        ? "Token has expired. Please log in again."
        : "Invalid token.",
    });
  }
};

