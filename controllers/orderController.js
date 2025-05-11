import { Order} from "../models/Order.js";
import { Product } from "../models/Product.js";


// get all orders
export const getAllOrders = async (req, res) => {
    try {
      const orders = await Oeder.find().sort({ createdAt: -1, isPinned: -1 });
      return res.json({
        orders,
        message: "เรียกดูคำสั่งซื้อทั้งหมดสำเร็จ",
      });
    } catch (err) {
      return res.status(500).json({
        message: "เรียกดูคำสั่งซื้อทั้งหมดไม่สำเร็จ",
        details: err.message,
      });
    }
  };

// create order in protected route
export const createNewOrder = async (req, res) => {
    const userId = req.user.userId; // Logged-in user's MongoDB _id

    const { orderItems } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "เข้าสู่ระบบก่อนการสั่งซื้อ" });
    }

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: "ไม่มีสินค้าในคำสั่งซื้อ" });
    }

    for (const item of orderItems) {
        if (!item.productId || !item.variantValue || !item.quantity) {
          return res.status(400).json({ message: "ข้อมูลสินค้าไม่ครบ" });
        }

        const product = await Product.findById(item.productId);
      if (!product || !product.variants.find(v => v.label === item.variantValue)) {
        return res.status(400).json({ message: `สินค้า ${item.productId} หรือ variant ไม่ถูกต้อง` });
      }
    }

    try {
        const order = await Order.create({
            userId, // Save user as ObjectId reference
            stateVariant,
            totalAmount,
            deliveryFee,
            orderItems,
        });

        return res.status(201).json({
            order,
            message: "สร้างคำสั่งซื้อใหม่สำเร็จ",
        });
    } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

