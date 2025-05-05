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
      trim: true,
      maxLength: [30, "Last name must be at most 30 characters"],
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please enter a valid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters long"],
    },
    photoURL: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/d_avatar.png/non_existing_id.png",
      validate(value) {
        if (
          value &&
          (!validator.isURL(value) ||
            !/\.(jpg|jpeg|png|webp|gif)$/i.test(value))
        ) {
          throw new Error(
            "Photo URL must be a valid image URL (jpg, jpeg, png, gif, webp)"
          );
        }
      },
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [150, "Age must be at most 150"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "Gender must be either male, female, or others",
      },
    },
    about: {
      type: String,
      trim: true,
      default: "This is about a developer",
      maxLength: [200, "About must be at most 200 characters"],
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("You can include a maximum of 10 skills");
        }
      },
    },
  },
  { timestamps: true }
);

// ✅ Method to validate password
userSchema.methods.validatePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// ✅ Method to generate JWT
userSchema.methods.getJWT = function () {
  return jwt.sign({ _id: this._id }, "#Rahul8620", { expiresIn: "1d" });
};

module.exports = mongoose.model("User", userSchema);
