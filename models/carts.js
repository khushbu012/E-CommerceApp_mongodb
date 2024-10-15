const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  items: [
    {
      productId: {
        type: mongoose.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
  userId: {
    type: mongoose.ObjectId,
    ref: "User",
    unique: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
