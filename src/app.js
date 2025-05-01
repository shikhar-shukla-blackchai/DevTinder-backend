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

app.get("/user", async (req, res) => {
  try {
    const users = await User.find({ emailId: req.body.emailId });
    if (users.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).json({ message: "something went wrong" });
  }
});

app.delete("/delete", async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.body.userId });
    res.send("User is deleted successfully");
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find();
    if (user.length === 0) {
      res.send("There is no one available in your feed");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

app.patch("/update", async (req, res) => {
  try {
    const _id = req.body._id;
    const updateData = req.body;
    const newUserData = await User.findByIdAndUpdate({ _id }, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
    res.json({ message: "data is updated successfully" });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
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
