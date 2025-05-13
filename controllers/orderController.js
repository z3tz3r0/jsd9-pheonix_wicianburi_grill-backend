import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import errMessage from "../utils/errMessage.js";

// create orderId
const generateOrderId = async () => {
  const today = new Date();
  const dateFormat = today.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD

  const start = new Date(today.setHours(0, 0, 0, 0));
  const end = new Date(today.setHours(23, 59, 59, 999));
  const count = await Order.countDocuments({
    createdAt: { $gte: start, $lte: end },
  });

  const numFormat = String(count + 1).padStart(4, "0");
  return `INV${dateFormat}-${numFormat}`;
};

// create order in protected route
export const createNewOrder = async (req, res, next) => {
  const userId = req.user?.user?._id;

  const { orderItems, totalAmount, deliveryFee, stateVariant } = req.body;

  if (!userId) {
    return next(errMessage(401, "เข้าสู่ระบบก่อนการสั่งซื้อ"));
  }

  if (!orderItems || orderItems.length === 0) {
    return next(errMessage(400, "ไม่มีสินค้าในคำสั่งซื้อ"));
  }

  // recheck products
  for (const item of orderItems) {
    if (!item.productId || !item.variantValue || !item.quantity) {
      return next(errMessage(400, "ข้อมูลสินค้าไม่ครบ"));
    }

    const product = await Product.findById(item.productId);
    if (!product) {
      return next(errMessage(400, `ไม่พบสินค้า: ${item.productId}`));
    }

    const variant = product.variants.find((v) => v.value === item.variantValue);
    if (!variant) {
      return next(
        errMessage(
          400,
          `ไม่พบ variant '${item.variantValue}' ในสินค้า ${product.name}`
        )
      );
    }
  }

  try {
    const orderId = await generateOrderId();
    const order = await Order.create({
      orderId,
      userId,
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
    return next(errMessage(500, "ไม่สามารถสร้างคำสั่งซื้อใหม่ได้"));
  }
};

// get all orders by user
export const getUserOrders = async (req, res, next) => {
  const user = req.user.user;
  //const user = req.user;

  try {
    const orders = await Order.find({ userId: user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      orders,
      message: "เรียกดูคำสั่งซื้อทั้งหมดสำเร็จ",
    });
  } catch (err) {
    return next(errMessage(500, "ไม่สามารถเรียกดูคำสั่งซื้อทั้งหมดได้"));
  }
};

// get order by id
export const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const user = req.user.user;

    const order = await Order.findOne({ _id: orderId, userId: user._id }).populate("orderItems.productId");

    if (!order) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
    }

    const formattedItems = order.orderItems.map(item => {
      const product = item.productId;
      const variant = product.variants.find(v => v.value === item.variantValue);

      return {
        _id: item._id,
        name: product.name,
        image: product.image,
        variantLabel: variant?.label || item.variantValue,
        price: variant?.price || 0,
        quantity: item.quantity,
      };
    });

    res.status(200).json({
      orderId: order.orderId,
      userId: order.userId,
      stateVariant: order.stateVariant,
      paymentSlipLink: order.paymentSlipLink,
      totalAmount: order.totalAmount,
      deliveryFee: order.deliveryFee,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: formattedItems,
      message: "เรียกดูรายละเอียดคำสั่งซื้อสำเร็จ",
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    return next(errMessage(500, "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ"));
  }
};


// update payment slip
export const updatePaymentSlip = async (req, res) => {
  const { orderId } = req.params;
  const { paymentSlipLink } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      { orderId: orderId },
      { paymentSlipLink },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
    }

    return res.status(200).json({
      order,
      message: "อัปเดตหลักฐานการชำระเงินสำเร็จ",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
