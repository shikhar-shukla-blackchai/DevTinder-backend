const express = require("express");
const { connectDB } = require("./config/database"); // Database
const app = express();
const { User } = require("./model/user");

app.use(express.json());

app.post("/signup", async (req, res, next) => {
  try {
    const user = await new User(req.body);
    console.log(User);
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
