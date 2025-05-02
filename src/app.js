const express = require("express");
const { connectDB } = require("./config/database"); // Database
const app = express();
const { User } = require("./model/user");
const { validateSignUpdata } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(404).send("Invalid Password");
    }

    const token = jwt.sign({ _id: user._id }, "DEV@TINDER$7777");

    res.cookie("token", token);

    res.send("Login successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookie = req.cookies;

    const { token } = cookie;

    if (!token) {
      res.status(400).send("Token is not provided!!!");
    }
    const decodedMessage = jwt.verify(token, "DEV@TINDER$7777");

    const user = await User.findById(decodedMessage._id);

    if (!user) {
      res.status(404).send("User not found");
    }

    console.log(user);
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong!!!");
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
