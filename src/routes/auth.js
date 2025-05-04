const { validateSignUpdata } = require("../utils/validation");
const { User } = require("../model/user");
const bcrypt = require("bcrypt");

const express = require("express");
const authRouter = express.Router();

authRouter.post("/signup", validateSignUpdata, async (req, res, next) => {
  try {
    const { password, firstName, lastName, age, gender, skills, emailId } =
      req.body;

    const passwordHashing = await bcrypt.hash(password, 12);

    // prettier-ignore
    const user = new User({firstName, lastName, password: passwordHashing, skills, emailId, age, gender, });

    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(500).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { password, emailId } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      res.status(404).send("ERROR : User not found");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      res.status(404).send("ERROR : Invalid credentials");
    }

    const token = await user.getJwt();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.send("Login successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successfully");
});

module.exports = { authRouter };
