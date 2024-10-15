const express = require("express");
const { placeOrder, orderHistory } = require("../controllers/orderController");
const { requireSignIn } = require("../middleware/authentication");
const Auth = require("../middleware/authorization");

const router = express.Router();

router.post("/placeorder", requireSignIn, Auth("buyer"), placeOrder);
router.get("/orderhistory", requireSignIn, Auth("buyer"), orderHistory);

module.exports = router;
