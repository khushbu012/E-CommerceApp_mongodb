const Cart = require("../models/carts");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body; // Check if cart already exists for the user

    const existingCart = await Cart.findOne({ userId });
    if (existingCart) {
      // If cart exists, check if product is already in the cart
      const existingItem = existingCart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        // If product already exists, update quantity
        existingItem.quantity += quantity;
      } else {
        // If product not in cart, add new item
        existingCart.items.push({ productId, quantity });
      }
      await existingCart.save();

      const populatedCart = await Cart.findOne({ userId }).populate(
        "items.productId"
      );

      return res
        .status(200)
        .json({ message: "Product added to cart", cart: populatedCart });
    } else {
      // If cart doesn't exist, create a new cart with the product
      const newCart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
      await newCart.save();
      const populatedCart = await Cart.findOne({ userId }).populate(
        "items.productId"
      );
      // await populatedCart.save();
      return res.status(201).json({
        message: "Cart created and product added",
        cart: populatedCart,
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getCartProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the cart for the user and populate the 'items.productId' field with the corresponding product details
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Extract product names from the populated product documents
    const productNames = cart.items.map((item) => {
      if (item.productId) {
        return item.productId.product_name; //product_name is the field in Product model
      }
      return null;
    });

    res.status(200).json({ success: true, productNames });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Manage cart items means increasing or decreasing the quantity
exports.manageCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.query.productId;
    const action = req.query.action;

    const existingCart = await Cart.findOne({ userId });
    if (!existingCart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const existingItem = existingCart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in the user cart",
      });
    }

    if (action === "increase") {
      existingItem.quantity++;
    } else if (action === "decrease") {
      existingItem.quantity--;

      if (existingItem.quantity === 0) {
        existingCart.items = existingCart.items.filter(
          (item) => item.productId.toString() !== productId
        );
      }
    } else {
      return res.status(400).json({
        success: false,
        message: `Invalid action '${action}'`,
      });
    }
    await existingCart.save();

    const populatedCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "product_name price",
    });
    return res.status(200).json({
      message: `${action} quantity`,
      updatedCart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cart not found" });
  }
};

// Delete a item from the cart of particular user
exports.deleteItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.query.productId;

    const existingCart = await Cart.findOne({ userId });
    if (!existingCart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    const existingItem = existingCart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in the user cart",
      });
    }

    await existingItem.deleteOne();

    // If there is only one item left in the cart then delete the whole cart
    if (existingCart.items.length === 1) {
      await existingCart.deleteOne();
    } else {
      await existingCart.save();
    }

    return res.status(200).json({
      success: true,
      RemainingItems: existingCart,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Another method to delete method (using splice)

// exports.deleteItem = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const productId = req.query.productId;

//     const existingCart = await Cart.findOne({ userId });
//     if (!existingCart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Cart not found" });
//     }

//     const existingItemIndex = existingCart.items.findIndex(
//       (item) => item.productId.toString() === productId
//     );

//     if (existingItemIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found in the user cart",
//       });
//     }

//     // Remove the item from the items array
//     existingCart.items.splice(existingItemIndex, 1);

//     // If there are no items left in the cart, delete the whole cart
//     if (existingCart.items.length === 0) {
//       await existingCart.deleteOne();
//     } else {
//       await existingCart.save();
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Item removed from the cart",
//     });
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };
