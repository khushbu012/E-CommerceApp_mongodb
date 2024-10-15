const User = require("../models/users");
const jwt = require("jsonwebtoken");
const {
  hashPassword,
  comparePassword,
} = require("../middleware/passwordEncrypt");

exports.signUp = async (req, res) => {
  const { username, email, phone, address, role, password, confirmPassword } =
    req.body;
  try {
    if (
      !username ||
      !email ||
      !phone ||
      !address ||
      !role ||
      !password ||
      !confirmPassword
    ) {
      return res
        .status(400)
        .json("Missing fields.Please enter all the fields.");
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Failed", error: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Failed",
        error: "Email is already in use. Please use a different email",
      });
    }

    const encrypted_password = await hashPassword(password);

    const newUser = new User({
      username,
      email,
      phone,
      address,
      role,
      password: encrypted_password,
      // confirmPassword,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User Registered Successfully", data: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "User Registration Failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json("Missing fields.Please enter both the fields.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email is not registered. Do registeration first" });
    }

    const password_match = await comparePassword(password, user.password);
    if (!password_match) {
      return res.status(401).json("Wrong Password");
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.LOGIN_EXPIRES,
    });
    res.status(200).json({
      success: true,
      message: "Login Successfully Done",
      token,
      // userData: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "User Login Failed" });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users) {
      res.status(400).json({ message: "No Users Found" });
    }
    res.status(200).json({ message: "Success", data: users });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Success", data: user });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    // });

    const { username, email, phone, address, role, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields based on the model
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.role = role || user.role;

    if (password) {
      user.password = await hashPassword(password);
    }

    await user.save();
    res.status(200).json({ message: "Success", data: user });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};
