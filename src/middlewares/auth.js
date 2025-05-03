const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.json({ message: "Invalid token" });
    }

    const decodedMessage = await jwt.verify(token, "#Rahul8620");

    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) {
      return res.json({ message: "user doesn't exist" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
