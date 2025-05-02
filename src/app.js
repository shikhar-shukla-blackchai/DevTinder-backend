const express = require("express");
const { connectDB } = require("./config/database"); // Database
const app = express();
const { User } = require("./model/user");
const { validateSignUpdata } = require("./utils/validation");
app.use(express.json());
const bcrypt = require("bcrypt");

app.post("/signup", validateSignUpdata, async (req, res, next) => {
  try {
    const { password, firstName, lastName, age, gender, skills, emailId } =
      req.body;

    const passwordHashing = await bcrypt.hash(password, 12);
    console.log(passwordHashing);

    // prettier-ignore
    const user = new User({firstName, lastName, password: passwordHashing, skills, emailId, age, gender, });

    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { password, emailId } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      res.status(404).send("Email not found");
    }
    console.log(user);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(404).send("Invalid Password");
    }

    res.send("Login successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
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

app.patch("/update/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;

    // prettier-ignore
    const ALLOWEDuPDATES = ["firsName", "lastName", "age","gender","skills", "photoUrl"];

    const isAllowedUpdate = Object.keys(data).every((k) =>
      ALLOWEDuPDATES.includes(k)
    );

    if (!isAllowedUpdate) {
      res.status(400).send("Update is not allowed");
    }

    const newUserData = await User.findByIdAndUpdate({ _id: userId }, data, {
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
