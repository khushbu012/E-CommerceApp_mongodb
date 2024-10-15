const express = require("express");
const {
  addToCart,
  getCartProducts,
  manageCartItems,
  deleteItem,
} = require("../controllers/cartController");
const { requireSignIn } = require("../middleware/authentication");
const Auth = require("../middleware/authorization");

const router = express.Router();

router.post("/addtocart", requireSignIn, Auth("buyer"), addToCart);
router.get("/get-allproducts", requireSignIn, Auth("buyer"), getCartProducts);
router.put(
  "/get-manageproducts",
  requireSignIn,
  Auth("buyer"),
  manageCartItems
);
router.delete(
  "/delete-product-fromcart",
  requireSignIn,
  Auth("buyer"),
  deleteItem
);

module.exports = router;
