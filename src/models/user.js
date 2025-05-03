const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minLength: [4, "first name must be atleast 4 characters"],
      maxLength: [30, "first name must be atmost 30 characters"],
    },
    lastName: {
      type: String,
      default: "",
      maxLength: [30, "last name must be atmost 30 characters"],
      trim: true,
      lowercase: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("please enter a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "password must be at least 8 characters"],
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("please enter a strong password");
        }
      },
    },
    age: {
      type: Number,
      min: [0, "age cannot be negative"],
      max: [150, "age seems unrealistic"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "please select a valid gender",
      },
      index: true,
    },
    about: {
      type: String,
      default: "this is about a developer",
      maxLength: [200, "about must be at most 200 characters"],
      trim: true,
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("skills must be at most 10");
        }
        for (let skill of value) {
          if (typeof skill !== "string" || skill.length === 0) {
            throw new Error("each skill must be a non-empty string");
          }
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index (optional, see explanation)
userSchema.index({ firstName: 1, lastName: 1 });

module.exports = mongoose.model("user", userSchema);
