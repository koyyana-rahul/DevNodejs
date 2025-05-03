const express = require("express");

const connectDB = require("../src/config/database");

const app = express();

connectDB()
  .then(() => {
    console.log("database connected");
    app.listen(7777, () => {
      console.log("server listening on port 7777....");
    });
  })
  .catch(() => {
    console.log("database not connected");
  });

// app.listen(7777, () => {
//   console.log("server listening on port 7777.....");
// });
