const User = require("../models/users");
const { requireSignIn } = require("../middleware/authentication");

const Auth = (role) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      const userRole = user.role;
      if (role.includes(userRole)) {
        next();
      } else {
        return res
          .status(403)
          .json({ message: "You don't have permission to access this page." });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error." });
    }
  };
};

module.exports = Auth;
