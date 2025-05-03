const express = require("express");

const app = express();

const authRouter = require("./routes/auth");

const connectDB = require("./config/database");

app.use(express.json());

app.use("/", authRouter);

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
