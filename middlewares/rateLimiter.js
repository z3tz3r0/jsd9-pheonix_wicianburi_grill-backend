import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // limit each IP to 100 requests
  standardHeaders: true,    // คืน rate limit ไปยัง `RateLimit-*` ใน headers 
  legacyHeaders: false,     // ปิด `X-RateLimit-*` ใน headers
});

export default limiter;
