const express = require("express");

const app = express();

const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const connectDB = require("./config/database");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("server listening on port 7777.....");
    });
    console.log("database connected");
  })
  .catch(() => {
    console.log("database not connected");
  });
