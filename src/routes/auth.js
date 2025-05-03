const express = require("express");

const authRouter = express.Router();

const bcrypt = require("bcrypt");

const User = require("../models/user");

const { validateSignup } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignup(req);

    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      about,
      skills,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      about,
      skills,
    });

    await user.save();
    res.send("signup successfull");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      console.log(token);
      res.cookie("token", token);
      res.send("login successfull");
    } else {
      return res.json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = authRouter;
