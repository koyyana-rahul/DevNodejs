const validator = require("validator");
const bcrypt = require("bcrypt");

const validateSignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

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
