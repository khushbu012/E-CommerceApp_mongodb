const express = require("express");
const {
  signUp,
  login,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { requireSignIn } = require("../middleware/authentication");
const router = express.Router();

router.post("/signup-user", signUp);
router.post("/login-user", login);
router.get("/get-allusers", getAllUser);
router.get("/get-userbyId/:id", getUserById);
router.put("/updateuser/:id", requireSignIn,updateUser);
router.delete("/deleteuser/:id", deleteUser);

module.exports = router;
