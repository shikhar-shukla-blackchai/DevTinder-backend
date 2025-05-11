const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validEditProfileData } = require("../utils/validation");
const { User } = require("../model/user");
const validator = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("ERROR : " + err.message);
  }
});

//prettier-ignore
profileRouter.patch("/profile/edit", validEditProfileData, userAuth, async(req, res) => {
  try{
    const loggedInUser = req.user;
    const user = req.body;
    
    Object.keys(req.body).forEach(key=>loggedInUser[key] = user[key])
    
      await loggedInUser.save()
    
      res.json({message:loggedInUser.firstName+ " User data is update successfully",
        data:loggedInUser
      })

   } catch (err) {
  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    // Collect specific field error messages
    const errors = Object.values(err.errors).map(e => e.message);

    res.status(400).json({
      message: "Validation failed",
      errors, // array of individual error messages
    });
  } else {
    // Other types of errors
    res.status(500).json({ message: "An unexpected error occurred" });
  }
}

  }
);

profileRouter.post("/profile/forgotPassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;

    const validateCurrentPassword = await user.validatePassword(
      currentPassword
    );

    if (!validateCurrentPassword) {
      //prettier-ignore
      return res.status(400).json({message: "Current password is invalid", "Current Password": currentPassword,});
    }

    const passwordIsStrong = await validator.isStrongPassword(newPassword);

    if (!passwordIsStrong) {
      //prettier-ignore
      return res.status(400).json({message: "Password is very week", "New Password": newPassword});
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({
      message: "Password updated successfully",
      "Newly updated password": newPassword,
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong!!" });
  }
});

module.exports = { profileRouter };
