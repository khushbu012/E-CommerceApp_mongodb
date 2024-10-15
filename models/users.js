const { mongoose } = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email."],
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
    },
    address: {
      type: {},
      required: true,
    },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

// const { mongoose } = require("mongoose");
// const validator = require("validator");

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       validate: [validator.isEmail, "Please enter a valid email."],
//     },
//     phone: {
//       type: String,
//       required: true,
//       length: 10,
//     },
//     address: {
//       type: {},
//       required: true,
//     },
//     role: {
//       type: String,
//       enum: ["buyer", "seller"],
//       default: "buyer",
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 8,
//     },
//     confirmPassword: {
//       type: String,
//       required: true, // if we will remove this field the code will work properly
//       validate: {
//         validator: function (val) {
//           console.log("val", val);
//           console.log(this.password);
//           return val === this.password;
//         },
//         message: "Passwords do not match.",
//       },
//       select: false,
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);
// module.exports = User;
