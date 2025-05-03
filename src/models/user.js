const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minLength: [4, "First name must be at least 4 characters"],
      maxLength: [30, "First name must be at most 30 characters"],
    },
    lastName: {
      type: String,
      default: "",
      maxLength: [30, "Last name must be at most 30 characters"],
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      index: true, // ✅ index for faster lookup
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please enter a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [150, "Age must be at most 150"],
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Please select a valid gender");
        }
      },
    },
    about: {
      type: String,
      default: "This is about a developer",
      maxLength: [200, "About must be at most 200 characters"],
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("Skills must be at most 10 items");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "#Rahul8620", {
    expiresIn: "1d",
  });
  return token;
};

module.exports = mongoose.model("User", userSchema);
