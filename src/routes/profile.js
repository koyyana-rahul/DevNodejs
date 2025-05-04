const express = require("express");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfile,
  validateForgotPassword,
} = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isUpdatedAllowed = validateEditProfile(req);
    if (!isUpdatedAllowed) {
      throw new Error("Invalid update field");
    }
    const loggedInUser = req.user;
    // console.log(loggedInUser);

    Object.keys(req.body).every((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    // console.log(loggedInUser);
    res.json({ message: "profile updated successfully", user: loggedInUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    let { password } = user;

    validateForgotPassword(password, req, res);

    const { newPassword } = req.body;

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    user.password = newPasswordHash;
    await user.save();

    res.json({ message: "password updated successfully" });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
