const Cart = require("../models/carts");
const Order = require("../models/orders");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "Your cart is empty. Add items before placing an order.",
      });
    }

    const totalAmount = cart.items.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );

    const order = new Order({
      userId: userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        productName: item.productId.product_name,
        quantity: item.quantity,
      })),
      totalAmount: totalAmount,
    });

    await order.save();

    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderedItems: order,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

exports.orderHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort("-createdAt");
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Orders Found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your previous orders:",
      previousOrder: orders,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};
