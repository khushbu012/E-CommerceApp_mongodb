const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const Auth = require("../middleware/authorization");
const { requireSignIn } = require("../middleware/authentication");
const router = express.Router();

router.post("/create-product", requireSignIn, Auth("seller"), createProduct);
router.get("/get-allproducts", requireSignIn, Auth("seller"), getAllProducts);
router.get(
  "/get-productbyId/:id",
  requireSignIn,
  Auth("seller"),
  getProductById
);
router.put("/update-product/:id", requireSignIn, Auth("seller"), updateProduct);
router.delete(
  "/delete-product/:id",
  requireSignIn,
  Auth("seller"),
  deleteProduct
);

module.exports = router;
