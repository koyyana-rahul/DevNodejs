const validator = require("validator");
const bcrypt = require("bcrypt");

const validateSignup = (req) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    photoURL,
    age,
    gender,
    about,
    skills,
  } = req.body;

  if (
    typeof firstName !== "string" ||
    firstName.length < 4 ||
    firstName.length > 30
  ) {
    throw new Error(
      "first name must be a string and must be between 4 and 30 characters"
    );
  }

  if (lastName && (typeof lastName !== "string" || lastName.length > 30)) {
    throw new Error(
      "last name must be a string and must be at most 30 characters"
    );
  }

  if (!emailId || typeof emailId !== "string" || !validator.isEmail(emailId)) {
    throw new Error("please enter a valid email Id");
  }

  if (
    !password ||
    typeof password !== "string" ||
    !validator.isStrongPassword(password)
  ) {
    throw new Error("please enter a strong password");
  }

  // ✅ photoURL validation (accepts URLs with query strings too)
  if (photoURL) {
    if (typeof photoURL !== "string" || !validator.isURL(photoURL)) {
      throw new Error("photoURL must be a valid URL");
    }

    const validImageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const lowerCasedURL = photoURL.toLowerCase().split("?")[0]; // Remove query string

    const isImageURL = validImageExtensions.some((ext) =>
      lowerCasedURL.endsWith(ext)
    );

    if (!isImageURL) {
      throw new Error("photoURL must point to an image (e.g., .jpg, .png)");
    }
  }

  if (age !== undefined) {
    if (typeof age !== "number" || age < 0 || age > 150) {
      throw new Error("age must be between 0 and 150");
    }
  }

  const validGender = ["male", "female", "others"];

  if (!gender || typeof gender !== "string" || !validGender.includes(gender)) {
    throw new Error("please select valid gender");
  }

  if (about && (typeof about !== "string" || about.length > 200)) {
    throw new Error("about must be atmost 200 characters");
  }

  if (skills) {
    if (!Array.isArray(skills)) {
      throw new Error("skills must be an array");
    }
    if (skills.length > 10) {
      throw new Error("skills must be atmost 10");
    }
    for (let skill of skills) {
      if (typeof skill !== "string" || skill.trim().length === 0) {
        throw new Error("each skill must be a non empty string");
      }
    }
  }
};

const validateForgotPassword = async (password, req, res) => {
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ message: "Both new Password and confim password are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "Both new password and confirm password must be equals",
    });
  }

  if (!validator.isStrongPassword(newPassword)) {
    return res.status(400).json({ message: "please enter a strong password" });
  }

  const isMatched = await bcrypt.compare(newPassword, password);

  if (isMatched) {
    return res
      .status(400)
      .json({ message: "new password must be different from old password" });
  }
};

const validateEditProfile = (req) => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "photoURL",
    "age",
    "gender",
    "about",
    "skills",
  ];
  const isUpdatedAllowed = Object.keys(req.body).every((key) =>
    allowedUpdates.includes(key)
  );
  return isUpdatedAllowed;
};

module.exports = {
  validateSignup,
  validateEditProfile,
  validateForgotPassword,
};
