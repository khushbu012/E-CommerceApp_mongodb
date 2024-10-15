const jwt = require("jsonwebtoken");

exports.requireSignIn = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
      token = token.slice(7);
    }
    if (!token) {
      return res.status(401).json({
        message: "You are not logged in! Please login to access this resource.",
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(decoded);
    req.user = decoded; // if we will console this then it will give us id, creation and expiration time

    // if user is deleted for some reason even after verifing the token
    // const user = await User.findById(decoded.id);
    // if (!user) {
    //   return res.status(404).json({ message: "User Not Found!" })
    // }
    // console.log(req.user.id);
    next();
  } catch (error) {
    res.status(400).json({ success: "failed", error: error.message });
  }
};
