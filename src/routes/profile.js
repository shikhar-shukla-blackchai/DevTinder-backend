const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
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

    }catch(err){
      res.json({message:"ERROR : "+err.message})
    }
 

  }
);

module.exports = { profileRouter };
