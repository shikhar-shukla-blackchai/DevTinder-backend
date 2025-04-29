const express = require("express");
const { connectDB } = require("./config/database"); // Database
const app = express();
const { User } = require("./model/user");

app.post("/signup", async (req, res, next) => {
  try {
    const user = new User({
      firstName: "Parth",
      lastName: "Yravadi",
      emailId: "Parth@gmail.com123",
      age: 15,
      gender: "mail",
    });

    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database is connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on the port 7777");
    });
  })
  .catch((err) => console.error(err.message));
